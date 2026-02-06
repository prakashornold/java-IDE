import { JavaProblem } from '../types/problem.types';
import { titleToSlug } from '../utils/stringUtils';

export class MetaTagService {
  private defaultTitle = 'JavaCodingPractice.com - Practice Java Coding Problems';
  private defaultDescription = 'JavaCodingPractice.com Makes Easy to Practice AnyTime AnyWhere';
  private siteName = 'JavaCodingPractice.com';

  updateProblemMetaTags(problem: JavaProblem): void {
    const title = `${problem.title} - ${this.siteName}`;
    const description = this.generateProblemDescription(problem);
    const url = `${window.location.origin}/problem/${titleToSlug(problem.title)}`;

    this.setMetaTag('og:title', title);
    this.setMetaTag('og:description', description);
    this.setMetaTag('og:url', url);
    this.setMetaTag('og:site_name', this.siteName);
    this.setMetaTag('og:type', 'website');

    this.setMetaTag('twitter:card', 'summary');
    this.setMetaTag('twitter:title', title);
    this.setMetaTag('twitter:description', description);

    document.title = title;
    this.setMetaTag('description', description, 'name');
  }

  private generateProblemDescription(problem: JavaProblem): string {
    let description = problem.description || `Practice ${problem.title} problem`;

    if (description.length > 150) {
      description = description.substring(0, 147) + '...';
    }

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

  private setMetaTag(property: string, content: string, attribute: 'property' | 'name' = 'property'): void {
    let metaTag = document.querySelector(`meta[${attribute}="${property}"]`);

    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, property);
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute('content', content);
  }

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

export const metaTagService = new MetaTagService();
