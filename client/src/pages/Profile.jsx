import { useSelector } from 'react-redux';

const Profile = () => {
  const { currentUser } = useSelector(state => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Профиль</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt={currentUser.username}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
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
