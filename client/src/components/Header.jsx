import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('q', searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTermFromUrl = params.get('q');

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/" className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">Nuar</span>
          <span className="text-slate-700">Estate</span>
        </Link>
        <form
          onSubmit={onSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Поиск"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <li className="cursor-pointer hidden sm:inline text-slate-700 hover:underline">
            <Link to="/">Главная</Link>
          </li>
          <li className="cursor-pointer hidden sm:inline text-slate-700 hover:underline">
            <Link to="/about">О нас</Link>
          </li>

          <li className="cursor-pointer hidden sm:inline text-slate-700 hover:underline">
            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt={currentUser.username}
                />
              ) : (
                'Авторизация'
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
