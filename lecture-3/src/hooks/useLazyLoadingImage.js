import { useEffect, useRef } from 'react';

const useLazyLoadingImage = () => {
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) {
      return;
    }

    const observerOptions = {};

    const observerCallback = ([{ isIntersecting, target }], observer) => {
      if (isIntersecting) {
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

  return { imgRef };
};

export default useLazyLoadingImage;
