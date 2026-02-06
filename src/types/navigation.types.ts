export type PageType = 'home' | 'dashboard' | 'admin' | 'about' | 'udemint' | 'freeai';

export interface NavigationProps {
  onNavigateHome: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToAbout?: () => void;
}

export interface PageComponentProps {
  onNavigateHome: () => void;
}
