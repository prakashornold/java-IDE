export type PageType = 'home' | 'dashboard' | 'admin' | 'account-settings' | 'about';

export interface NavigationProps {
  onNavigateHome: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToAccountSettings?: () => void;
  onNavigateToAbout?: () => void;
}

export interface PageComponentProps {
  onNavigateHome: () => void;
}
