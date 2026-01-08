import { JavaProblem } from '../types/problem.types';

/**
 * Service for managing HTML meta tags dynamically
 * Handles Open Graph and Twitter Card meta tags for social sharing
 * Follows Single Responsibility Principle
 */
export class MetaTagService {
    private defaultTitle = 'JavaCodingPractice.com - Practice Java Coding Problems';
    private defaultDescription = 'JavaCodingPractice.com Makes Easy to Practice AnyTime AnyWhere';
    private siteName = 'JavaCodingPractice.com';

    /**
     * Updates meta tags for a specific problem
     * Includes problem title, description, input, and output
     * 
     * @param problem - Problem data to generate meta tags from
     */
    updateProblemMetaTags(problem: JavaProblem): void {
        const title = `${problem.title} - ${this.siteName}`;
        const description = this.generateProblemDescription(problem);
        const url = `${window.location.origin}/problem/${this.titleToSlug(problem.title)}`;

        this.setMetaTag('og:title', title);
        this.setMetaTag('og:description', description);
        this.setMetaTag('og:url', url);
        this.setMetaTag('og:site_name', this.siteName);
        this.setMetaTag('og:type', 'website');

        this.setMetaTag('twitter:card', 'summary');
        this.setMetaTag('twitter:title', title);
        this.setMetaTag('twitter:description', description);

        // Update page title
        document.title = title;

        // Update canonical meta description
        this.setMetaTag('description', description, 'name');
    }

    /**
     * Generates a comprehensive description for a problem
     * Includes problem description, sample input, and expected output
     * 
     * @param problem - Problem to generate description from
     * @returns Formatted description string
     */
    private generateProblemDescription(problem: JavaProblem): string {
        let description = problem.description || `Practice ${problem.title} problem`;

        // Limit description length for meta tags
        if (description.length > 150) {
            description = description.substring(0, 147) + '...';
        }

        // Add input/output if available
        if (problem.input && problem.output) {
            const inputPreview = problem.input.length > 50
                ? problem.input.substring(0, 47) + '...'
                : problem.input;
            const outputPreview = problem.output.length > 50
                ? problem.output.substring(0, 47) + '...'
                : problem.output;

            description += ` | Input: ${inputPreview} | Output: ${outputPreview}`;
        }

        return description;
    }

    /**
     * Sets or updates a meta tag
     * 
     * @param property - Meta tag property/name
     * @param content - Content value
     * @param attribute - Attribute type ('property' or 'name')
     */
    private setMetaTag(property: string, content: string, attribute: 'property' | 'name' = 'property'): void {
        let metaTag = document.querySelector(`meta[${attribute}="${property}"]`);

        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute(attribute, property);
            document.head.appendChild(metaTag);
        }

        metaTag.setAttribute('content', content);
    }

    /**
     * Converts title to URL slug
     * Reuses logic from ProblemLinkService
     */
    private titleToSlug(title: string): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Resets meta tags to default values
     * Called when no problem is selected
     */
    resetToDefaults(): void {
        this.setMetaTag('og:title', this.defaultTitle);
        this.setMetaTag('og:description', this.defaultDescription);
        this.setMetaTag('og:url', window.location.origin);
        this.setMetaTag('og:site_name', this.siteName);
        this.setMetaTag('og:type', 'website');

        this.setMetaTag('twitter:card', 'summary');
        this.setMetaTag('twitter:title', this.defaultTitle);
        this.setMetaTag('twitter:description', this.defaultDescription);

        document.title = this.defaultTitle;
        this.setMetaTag('description', this.defaultDescription, 'name');
    }
}

/**
 * Singleton instance of the meta tag service
 */
export const metaTagService = new MetaTagService();
