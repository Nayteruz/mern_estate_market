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
} from '../store/user/userSlice';
import { useDispatch } from 'react-redux';
import { app } from '../firebase.js';

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
      </form>
      <div className="flex justify-between align-middle mt-5">
        <span onClick={onDeleteUser} className="text-red-700 cursor-pointer">
          Удалить аккаунт
        </span>
        <span className="text-red-700 cursor-pointer">Выйти из аккаунта</span>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5">
          {updateSuccess ? 'Данные обновлены!' : ''}
        </p>
      )}
    </div>
  );
};

export default Profile;
