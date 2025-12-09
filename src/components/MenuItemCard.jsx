import React from "react";

const MenuItemCard = ({
  item,
  cartQuantity,
  onAddToCart,
  onRemoveFromCart,
}) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl">
      {/* Item Image */}
      {item.imageURL && (
        <div className="w-full h-48 sm:h-56 overflow-hidden bg-gray-50">
          <img
            src={item.imageURL}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Item Content */}
      <div className="p-5 sm:p-6">
        {/* Item Header */}
        <div className="mb-5">
          <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight mb-2">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Quantity Controls - Minimal Design */}
        {cartQuantity === 0 ? (
          <button
            onClick={() => onAddToCart(item)}
            className="w-full bg-black hover:bg-gray-800 active:bg-gray-900 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-100">
            {/* Minus Button */}
            <button
              onClick={() => onRemoveFromCart(item.id)}
              className="flex-shrink-0 w-10 h-10 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center border border-gray-200 hover:border-gray-300 shadow-sm"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
            </button>

            {/* Quantity Display */}
            <div className="flex-1 text-center">
              <div className="text-xl font-bold text-gray-900">
                {cartQuantity}
              </div>
            </div>

            {/* Plus Button */}
            <button
              onClick={() => onAddToCart(item)}
              className="flex-shrink-0 w-10 h-10 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center border border-gray-200 hover:border-gray-300 shadow-sm"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
