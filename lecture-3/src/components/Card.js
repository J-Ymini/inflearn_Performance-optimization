import React, { useRef, useEffect } from 'react';
import useLazyLoadingImage from '../hooks/useLazyLoadingImage';

function Card({ children, image }) {
  const { imgRef } = useLazyLoadingImage();

  return (
    <div className="Card text-center">
      <img data-src={image} ref={imgRef} />
      <div className="p-5 font-semibold text-gray-700 text-xl md:text-lg lg:text-xl keep-all">
        {children}
      </div>
    </div>
  );
}

export default Card;
