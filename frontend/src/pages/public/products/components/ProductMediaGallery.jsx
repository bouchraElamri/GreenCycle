import React, { memo } from "react";

function ProductMediaGallery({ galleryImages, productName, resolveImageUrl, onThumbnailClick }) {
  return (
    <div className="w-full md:w-1/2 rounded-3xl flex flex-col gap-1 p-0">
      <div className="md:w-5/6 md:h-64 w-full h-48 rounded-3xl overflow-hidden flex items-center justify-center">
        <img
          src={resolveImageUrl(galleryImages[0])}
          alt={productName}
          className="w-auto h-full max-w-full object-cover rounded-3xl"
        />
      </div>
      <div className="flex flex-row gap-2 ml-2 md:ml-0 mt-2 md:mt-0">
        {galleryImages.slice(1).map((img, index) => (
          <div
            key={`${img}-${index}`}
            className="md:w-20 md:h-20 w-24 h-24 rounded-3xl overflow-hidden flex md:items-center md:justify-center mt-0"
          >
            <img
              src={resolveImageUrl(img)}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover rounded-3xl cursor-pointer"
              onClick={() => onThumbnailClick(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ProductMediaGallery);
