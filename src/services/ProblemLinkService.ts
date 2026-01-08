/**
 * Service for handling problem URL generation and parsing
 * Converts problem titles to URL-friendly slugs and manages browser history
 * Follows Single Responsibility Principle
 */
export class ProblemLinkService {
    /**
     * Converts a problem title to a URL-friendly slug
     * Example: "Two Sum" → "two-sum"
     * Example: "Find Duplicate Elements from List" → "find-duplicate-elements-from-list"
     * 
     * @param title - Problem title to convert
     * @returns URL-friendly slug in kebab-case
     */
    titleToSlug(title: string): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    /**
     * Converts a URL slug back to a searchable title pattern
     * Example: "two-sum" → "two sum" (for case-insensitive search)
     * 
     * @param slug - URL slug to convert
     * @returns Search pattern for title matching
     */
    slugToTitlePattern(slug: string): string {
        return slug.replace(/-/g, ' ');
    }

    /**
     * Generates a shareable URL for a problem using its title
     * Uses path-based format: /problem/slug
     * 
     * @param title - Problem title
     * @returns Full shareable URL with path parameter
     */
    generateProblemUrl(title: string): string {
        const slug = this.titleToSlug(title);
        const baseUrl = window.location.origin;
        return `${baseUrl}/problem/${slug}`;
    }

    /**
     * Extracts the problem slug from the current URL path
     * Supports format: /problem/:slug
     * 
     * @returns Problem slug if present in path, null otherwise
     */
    getProblemSlugFromUrl(): string | null {
        const pathMatch = window.location.pathname.match(/^\/problem\/([^/]+)$/);
        return pathMatch ? pathMatch[1] : null;
    }

    /**
     * Updates the browser URL with the problem slug without page reload
     * Uses HTML5 History API for seamless navigation
     * Format: /problem/slug
     * 
     * @param title - Problem title to add to URL
     */
    updateUrlWithProblem(title: string): void {
        const slug = this.titleToSlug(title);
        const newUrl = `/problem/${slug}`;

        // Update URL without reloading the page
        window.history.pushState({ problemSlug: slug }, '', newUrl);
    }

    /**
     * Clears the problem parameter from the URL
     */
    clearProblemFromUrl(): void {
        window.history.pushState({}, '', window.location.pathname);
    }

    /**
     * Copies the problem URL to the clipboard
     * 
     * @param title - Problem title
     * @returns Promise resolving to true if successful, false otherwise
     */
    async copyProblemUrlToClipboard(title: string): Promise<boolean> {
        try {
            const url = this.generateProblemUrl(title);
            await navigator.clipboard.writeText(url);
            return true;
        } catch (error) {
            console.error('Failed to copy URL to clipboard:', error);

            // Fallback for older browsers
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
            } catch (fallbackError) {
                console.error('Fallback copy also failed:', fallbackError);
                return false;
            }
        }
    }
}

/**
 * Singleton instance of the problem link service
 */
export const problemLinkService = new ProblemLinkService();
