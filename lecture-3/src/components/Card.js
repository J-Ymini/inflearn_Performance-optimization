import React, { useRef, useEffect } from 'react';

function Card({ children, image }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const observerOptions = {};

    const observerCallback = ([{ isIntersecting, target }], observer) => {
      if (isIntersecting && !target.src) {
        target.src = target.dataset.src;
        observer.unobserve(imgRef.current);
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    observer.observe(imgRef.current);
  }, []);

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
