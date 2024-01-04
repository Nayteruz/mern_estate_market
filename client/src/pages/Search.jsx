import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/Spinner.jsx';
import ListingItem from '@/components/ListingItem.jsx';

const Search = () => {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('q');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };

    fetchListing();
  }, [location.search]);

  const onChange = (e) => {
    const { id, value, checked } = e.target;

    if (['all', 'rent', 'sale'].includes(id)) {
      setSidebarData({ ...sidebarData, type: id });
    }

    if (id === 'searchTerm') {
      console.log;
      setSidebarData({ ...sidebarData, searchTerm: value });
    }

    if (['parking', 'furnished', 'offer'].includes(id)) {
      setSidebarData({
        ...sidebarData,
        [id]: !!(checked || checked === 'true'),
      });
    }

    if (id === 'sort_order') {
      const sort = value.split('_')[0] || 'created_at';
      const order = value.split('_')[1] || 'desc';

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('q', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen select-none">
        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label htmlFor="seachTerm" className="text-nowrap font-semibold">
              Поиск по:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Поиск..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={onChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Тип:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={onChange}
                checked={sidebarData.type === 'all'}
              />
              <label htmlFor="all">Аренда и продажа</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={onChange}
                checked={sidebarData.type === 'rent'}
              />
              <label htmlFor="rent">Аренда</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={onChange}
                checked={sidebarData.type === 'sale'}
              />
              <label htmlFor="sale">Продажа</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={onChange}
                checked={sidebarData.offer}
              />
              <label htmlFor="offer">Агент</label>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Удобства:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={onChange}
                checked={sidebarData.parking}
              />
              <label htmlFor="parking">Парковка</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={onChange}
                checked={sidebarData.furnished}
              />
              <label htmlFor="furnished">Мебелиронная</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort_order" className="text-nowrap font-semibold">
              Сортировать:
            </label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={onChange}
              defaultValue={'created_at'}
            >
              <option value="regularPrice_desc">Цена по убыванию</option>
              <option value="regularPrice_asc">Цена по возрастанию</option>
              <option value="createdAt_desc">По дате новые</option>
              <option value="createdAt_asc">По дате старые</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Поиск
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Результаты поиска:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">Список объявлений пуст!</p>
          )}
          {loading && (
            <p className="text-center">
              <Spinner size={24} />
            </p>
          )}
          {!loading && listings && (
            <div className="grid w-full lg:grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
