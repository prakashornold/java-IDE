import { useState, useCallback, useEffect } from 'react';
import { PageType } from '../types/navigation.types';

export interface UseNavigationResult {
  currentPage: PageType;
  navigateToHome: () => void;
  navigateToAdmin: () => void;
}

export function useNavigation(initialPage: PageType = 'home'): UseNavigationResult {
  const [currentPage, setCurrentPage] = useState<PageType>(initialPage);

  const getPageFromPath = useCallback((path: string): PageType => {
    if (path === '/' || path === '') return 'home';
    if (path === '/admin') return 'admin';
    if (path === '/about') return 'about';
    if (path === '/udemint') return 'udemint';
    if (path === '/freeai') return 'freeai';
    return 'home';
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath(window.location.pathname);
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getPageFromPath]);

  const navigateTo = useCallback((page: PageType) => {
    setCurrentPage(page);
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(null, '', path);
  }, []);

  const navigateToHome = useCallback(() => navigateTo('home'), [navigateTo]);
  const navigateToAdmin = useCallback(() => navigateTo('admin'), [navigateTo]);

  return {
    currentPage,
    navigateToHome,
    navigateToAdmin,
  };
}
