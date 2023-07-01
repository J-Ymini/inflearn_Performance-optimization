import React, { useRef, useEffect } from 'react';
import useLazyLoadingImage from '../hooks/useLazyLoadingImage';

function Card({ children, image, webp }) {
  const { imgRef } = useLazyLoadingImage();

  return (
    <div className="Card text-center">
      <picture>
        <source data-srcset={webp} type="image/webp" />
        <img data-src={image} ref={imgRef} />
      </picture>
      <div className="p-5 font-semibold text-gray-700 text-xl md:text-lg lg:text-xl keep-all">
        {children}
      </div>
    </div>
  );
}

export default Card;
