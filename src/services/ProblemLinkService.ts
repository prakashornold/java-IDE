import { titleToSlug, slugToTitlePattern } from '../utils/stringUtils';

export class ProblemLinkService {
  titleToSlug(title: string): string {
    return titleToSlug(title);
  }

  slugToTitlePattern(slug: string): string {
    return slugToTitlePattern(slug);
  }

  generateProblemUrl(title: string): string {
    const slug = titleToSlug(title);
    const baseUrl = window.location.origin;
    return `${baseUrl}/problem/${slug}`;
  }

  getProblemSlugFromUrl(): string | null {
    const pathMatch = window.location.pathname.match(/^\/problem\/([^/]+)$/);
    return pathMatch ? pathMatch[1] : null;
  }

  updateUrlWithProblem(title: string): void {
    const slug = titleToSlug(title);
    const newUrl = `/problem/${slug}`;
    window.history.pushState({ problemSlug: slug }, '', newUrl);
  }

  clearProblemFromUrl(): void {
    window.history.pushState({}, '', window.location.pathname);
  }

  async copyProblemUrlToClipboard(title: string): Promise<boolean> {
    try {
      const url = this.generateProblemUrl(title);
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = this.generateProblemUrl(title);
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch {
        return false;
      }
    }
  }
}

export const problemLinkService = new ProblemLinkService();
