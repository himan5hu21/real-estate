import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const { imageUrls, area, bedrooms, bathrooms, address, price, type } =
    property;

  const imageUrl = imageUrls[0];

  return (
    <a
      href="#"
      className="block bg-white rounded-lg shadow-md shadow-indigo-100 w-64"
    >
      <div className="aspect-w-16 aspect-h-9">
        <img
          alt=""
          src={`${
            imageUrl ||
            "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          }`}
          loading="lazy"
          className="h-56 w-full rounded-tl-md rounded-tr-md object-cover"
        />
      </div>

      <div className="mt-2 px-4 pb-4">
        <dl>
          <div>
            <dt className="sr-only">Price</dt>

            <dd className="text-lg font-semibold text-gray-900">
              <span>₹{price}</span>
              <span>{type === "rent" && "/month"}</span>
            </dd>
          </div>

          <div className="mt-1">
            <dt className="sr-only">Name/Title</dt>

            <dd className="text-sm font-semibold text-gray-900">{area}</dd>
          </div>

          <div>
            <dt className="sr-only">Address</dt>

            <dd className="text-sm text-gray-500">
              {address.city + ", " + address.state + ", " + address.country}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex items-center gap-8 text-xs">
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <svg
              className="size-4 text-sky-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>

            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Bathroom</p>

              <p className="font-medium">{bathrooms} rooms</p>
            </div>
          </div>

          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <svg
              className="size-4 text-sky-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>

            <div className="mt-1.5 sm:mt-0">
              <p className="text-gray-500">Bedroom</p>

              <p className="font-medium">{bedrooms} rooms</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.array.isRequired,
    area: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    address: PropTypes.object.isRequired,
    price: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default PropertyCard;
