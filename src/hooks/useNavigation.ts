import { useState, useCallback } from 'react';
import { PageType } from '../types/navigation.types';

export interface UseNavigationResult {
  currentPage: PageType;
  navigateToHome: () => void;
  navigateToDashboard: () => void;
  navigateToAdmin: () => void;
  navigateToAccountSettings: () => void;
  navigateToAbout: () => void;
}

export function useNavigation(initialPage: PageType = 'home'): UseNavigationResult {
  const [currentPage, setCurrentPage] = useState<PageType>(initialPage);

  const navigateToHome = useCallback(() => setCurrentPage('home'), []);
  const navigateToDashboard = useCallback(() => setCurrentPage('dashboard'), []);
  const navigateToAdmin = useCallback(() => setCurrentPage('admin'), []);
  const navigateToAccountSettings = useCallback(() => setCurrentPage('account-settings'), []);
  const navigateToAbout = useCallback(() => setCurrentPage('about'), []);

  return {
    currentPage,
    navigateToHome,
    navigateToDashboard,
    navigateToAdmin,
    navigateToAccountSettings,
    navigateToAbout,
  };
}
