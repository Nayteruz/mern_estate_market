import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white flex flex-col w-full shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="object-cover w-full h-[320px] hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 overflow-hidden truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700 flex-shrink-0 flex-grow-0 flex-auto" />
            <p className="text-sm text-gray-600 truncate">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 clamp-2">{listing.description}</p>
          <p className="text-slate-500 mt-2 font-semibold flex items-center">
            {listing.offer
              ? listing.discountedPrice.toLocaleString('ru-RU')
              : listing.regularPrice.toLocaleString('ru-RU')}
            {listing.type === 'rent' ? ' руб. / месяц' : ' руб.'}
          </p>
          <div className="flex flex-wrap font-bold text-xs text-slate-700 gap-4">
            <div>{listing.bedrooms && `кроватей - ${listing.bedrooms}`}</div>
            <div>{listing.bathrooms && `ванн - ${listing.bathrooms}`}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
