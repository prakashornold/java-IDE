export type PageType = 'home' | 'dashboard' | 'admin' | 'account-settings' | 'about';

export interface INavigationService {
  getCurrentPage(): PageType;
  navigateTo(page: PageType): void;
  onPageChange(callback: (page: PageType) => void): () => void;
}

export class NavigationService implements INavigationService {
  private currentPage: PageType = 'home';
  private listeners: Set<(page: PageType) => void> = new Set();

  getCurrentPage(): PageType {
    return this.currentPage;
  }

  navigateTo(page: PageType): void {
    this.currentPage = page;
    this.notifyListeners();
  }

  onPageChange(callback: (page: PageType) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentPage));
  }
}

export const navigationService = new NavigationService();
