import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase.js';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 500,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const { listingId } = params;

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setFormData(data);
    };
    fetchListing();
  }, [params]);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  };

  const onRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const onFilesSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError('');
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError('');
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError(
            'Ошибка загрузки файлов (максимум 2 МБ для изображения)',
          );
          setUploading(false);
        });
    } else {
      setImageUploadError('Можно загружать не более 6 изображений');
      setUploading(false);
    }
  };

  const onChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (['sale', 'rent'].includes(name)) {
      setFormData({
        ...formData,
        type: name,
      });
    }
    if (['parking', 'furnished', 'offer'].includes(name)) {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }

    if (['number', 'text', 'textarea'].includes(type)) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      return setSubmitError('Необходимо загрузить не менее 1 фото');
    }

    if (+formData.regularPrice < +formData.discountedPrice) {
      return setSubmitError('Цена скидки должна быть меньше основной цены');
    }

    try {
      setLoading(true);
      setSubmitError('');

      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setSubmitError(data.message);
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setSubmitError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Изменить объявление
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Имя"
            className="border p-3 rounded-lg w-full"
            maxLength={62}
            minLength={10}
            required
            onChange={onChange}
            value={formData.name}
          />
          <textarea
            name="description"
            id="description"
            placeholder="Описание"
            className="border p-3 rounded-lg w-full"
            required
            onChange={onChange}
            value={formData.description}
          ></textarea>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Адрес"
            className="border p-3 rounded-lg w-full"
            required
            onChange={onChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="sale"
                id="sale"
                className="w-5"
                onChange={onChange}
                checked={formData.type === 'sale'}
              />
              <span>Продажа</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="rent"
                id="rent"
                className="w-5"
                checked={formData.type === 'rent'}
                onChange={onChange}
              />
              <span>Аренда</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5"
                onChange={onChange}
                checked={formData.parking}
              />
              <span>Парковочное место</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5"
                onChange={onChange}
                checked={formData.furnished}
              />
              <span>Мебелированная</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="offer"
                id="offer"
                className="w-5"
                onChange={onChange}
                checked={formData.offer}
              />
              <span>Агент</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={onChange}
                value={formData.bedrooms}
              />
              <p>Кровать</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={onChange}
                value={formData.bathrooms}
              />
              <p>Ванная</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                min={500}
                max={1000000}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={onChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Цена</p>
                {formData.type === 'rent' && (
                  <span className="text-xs">(руб/месяц)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="discountedPrice"
                  id="discountedPrice"
                  min={0}
                  max={1000000}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={onChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Со скидкой</p>
                  {formData.type === 'rent' && (
                    <span className="text-xs">(руб/месяц)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Фото:
            <span className="font-normal text-green-600 ml-2">
              Первое фото - обложка, максмум 6
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              onClick={onFilesSubmit}
              type="button"
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? 'Загрузка...' : 'Загрузить'}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center gap-2"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  onClick={() => onRemoveImage(index)}
                >
                  Удалить
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Загрузка объявления...' : 'Изменить объявление'}
          </button>
          {submitError && <p className="text-red-700 text-sm">{submitError}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
