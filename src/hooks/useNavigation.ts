import { useState, useCallback, useEffect } from 'react';
import { PageType } from '../types/navigation.types';

export interface UseNavigationResult {
  currentPage: PageType;
  navigateToHome: () => void;
  navigateToAdmin: () => void;
  navigateToInterviewPrep: () => void;
}

export function useNavigation(initialPage: PageType = 'home'): UseNavigationResult {
  const [currentPage, setCurrentPage] = useState<PageType>(initialPage);

  const getPageFromPath = useCallback((path: string): PageType => {
    if (path === '/' || path === '') return 'home';
    if (path === '/admin') return 'admin';
    if (path === '/udemint') return 'udemint';
    if (path === '/freeai') return 'freeai';
    if (path === '/interview-preparation') return 'interview-prep';
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
    const pathMap: Record<PageType, string> = {
      'home': '/',
      'admin': '/admin',
      'udemint': '/udemint',
      'freeai': '/freeai',
      'interview-prep': '/interview-preparation',
    };
    window.history.pushState(null, '', pathMap[page]);
  }, []);

  const navigateToHome = useCallback(() => navigateTo('home'), [navigateTo]);
  const navigateToAdmin = useCallback(() => navigateTo('admin'), [navigateTo]);
  const navigateToInterviewPrep = useCallback(() => navigateTo('interview-prep'), [navigateTo]);

  return {
    currentPage,
    navigateToHome,
    navigateToAdmin,
    navigateToInterviewPrep,
  };
}
