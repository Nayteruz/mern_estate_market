import { useSelector } from 'react-redux';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../store/user/userSlice';
import { useDispatch } from 'react-redux';
import { app } from '../firebase.js';
import { Link } from 'react-router-dom';
import { Spinner } from '../components/Spinner.jsx';

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loadListings, setLoadListings] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(err));
    }
  };

  const onSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdateSuccess(false);
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const onUpload = useRef((file) => {
    if (file.size > 2 * 1024 * 1024) {
      setUploadError(true);
      return;
    }
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setUploadPercent(progress);
      },
      () => {
        setUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      },
    );
  });

  const showListings = async () => {
    setLoadListings(true);
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (err) {
      setShowListingsError(true);
    } finally {
      setLoadListings(false);
    }
  };

  const onDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId),
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const onUploadAction = onUpload.current;

    if (file) {
      onUploadAction(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Профиль</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData?.avatar || currentUser?.avatar}
          alt={currentUser.username}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="flex justify-center text-sm">
          {uploadError ? (
            <span className="text-red-700">
              Ошибка загрузки изображения (не более 2 МБ)
            </span>
          ) : uploadPercent > 0 && uploadPercent < 100 ? (
            <span className="text-slate-700">{`Загрузка ${uploadPercent}%`}</span>
          ) : uploadPercent === 100 ? (
            <span className="text-green-700">Загрузка завершена!</span>
          ) : (
            ''
          )}
        </p>

        <input
          type="text"
          placeholder="Имя пользователя"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={onChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="border p-3 rounded-lg"
          id="password"
          onChange={onChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 p-3 text-white outline-none rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Обновление...' : 'Обновить'}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to="/create-listing"
        >
          Добавить объявление
        </Link>
      </form>
      <div className="flex justify-between align-middle mt-5">
        <span onClick={onDeleteUser} className="text-red-700 cursor-pointer">
          Удалить аккаунт
        </span>
        <span onClick={onSignOut} className="text-red-700 cursor-pointer">
          Выйти из аккаунта
        </span>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5">
          {updateSuccess ? 'Данные обновлены!' : ''}
        </p>
      )}
      <button onClick={showListings} className="text-green-700 w-full mt-3">
        Показать объявления
      </button>
      {showListingsError && (
        <p className="text-red-700 mt-5">Ошибка показа объявлений</p>
      )}
      {loadListings && (
        <p className="flex items-center justify-center mt-5">
          <Spinner size={24} />
        </p>
      )}
      {userListings && !loadListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-center mt-7 text-2xl font-semibold ">
            Ваши объявления
          </h2>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex justify-between items-center gap-4 border rounded-lg p-2"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="h-16 w-16 object-contain rounded-lg"
                />
              </Link>
              <Link to={`/listing/${listing._id}`} className="flex-1">
                <p className="text-slate-700 font-semibold flex-1 hover:underline truncate">
                  {listing.name}
                </p>
              </Link>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onDeleteListing(listing._id)}
                  className="text-red-700 uppercase text-sm hover:underline"
                >
                  Удалить
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase text-sm hover:underline">
                    Изменить
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
