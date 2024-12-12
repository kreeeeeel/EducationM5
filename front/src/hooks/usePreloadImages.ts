// src/hooks/usePreloadImages.ts

import { useEffect } from 'react';

const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
};

const usePreloadImages = (images: string[]) => {
    useEffect(() => {
        images.forEach(preloadImage);
    }, [images]);
};

export default usePreloadImages;
