import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import ListingItem from '@/components/ListingItem.jsx';

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchListings = async (fetchString, callback) => {
      try {
        const res = await fetch(`/api/listing/get?${fetchString}`);
        const data = await res.json();
        callback(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchListings('offer=true&limit=4', (data) => setOfferListings(data));
    fetchListings('type=sale&limit=4', (data) => setSaleListings(data));
    fetchListings('type=rent&limit=4', (data) => setRentListings(data));
  }, []);

  return (
    <div>
      {/*top*/}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl md:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <div className="text-gray-400 text-sm lg:text-xl">
          Откройте дверь в мир идеального жилья с нашей помощью!
          <br />
          Мы специализируемся на продаже и аренде разнообразной недвижимости.
          <br />
          Независимо от ваших потребностей, мы гарантируем профессиональный
          подход.
          <br />
          Найдите свое идеальное жилье с нами!
        </div>
        <Link
          to={'/search'}
          className="text-sx sm:text-sm text-blue-400 font-bold hover:underline mr-auto"
        >
          Давайте начнем...
        </Link>
      </div>

      {/* swiper */}
      {offerListings && offerListings.length > 0 && (
        <Swiper navigation={true} loop={true}>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[350px] md:h-[500px]"
                style={{
                  background: `url(${listing.imageUrls[0]}) center center no-repeat`,
                  backgroundSize: 'cover',
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* listing results offer sale rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Последние предложения
              </h2>
              <Link
                className="text-sm text-blue-400 hover:underline"
                to={'/search?offer=true'}
              >
                Посмотреть еще предложения
              </Link>
            </div>
            <div className="gap-4 grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 ss:grid-cols-1">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Последние предложения продажи
              </h2>
              <Link
                className="text-sm text-blue-400 hover:underline"
                to={'/search?type=sale'}
              >
                Посмотреть еще предложения продажи
              </Link>
            </div>
            <div className="gap-4 grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 ss:grid-cols-1">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Последние предложения аренды
              </h2>
              <Link
                className="text-sm text-blue-400 hover:underline"
                to={'/search?type=rent'}
              >
                Посмотреть еще предложения аренды
              </Link>
            </div>
            <div className="gap-4 grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 ss:grid-cols-1">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
