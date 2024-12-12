// src/components/ScrollToTop.tsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент ScrollToTop автоматически прокручивает страницу вверх при изменении маршрута.
 */
const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // Можно заменить на 'auto' для мгновенной прокрутки
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
