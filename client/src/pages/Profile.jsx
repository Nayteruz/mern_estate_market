import { useSelector } from 'react-redux';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { useRef, useState, useEffect } from 'react';
import { app } from '../firebase.js';

const Profile = () => {
  const { currentUser } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const onUpload = useRef(file => {
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
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setUploadPercent(progress);
      },
      () => {
        setUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
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
      <form className="flex flex-col gap-4">
        <input
          onChange={e => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
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
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="Пароль"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          type="submit"
          className="bg-slate-700 p-3 text-white outline-none rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          Обновить
        </button>
      </form>
      <div className="flex justify-between align-middle mt-5">
        <span className="text-red-700 cursor-pointer">Удалить аккаунт</span>
        <span className="text-red-700 cursor-pointer">Выйти из аккаунта</span>
      </div>
    </div>
  );
};

export default Profile;
