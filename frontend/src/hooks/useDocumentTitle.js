import { useEffect } from 'react';

/**
 * Custom Hook: useDocumentTitle
 * Dynamically updates document title and Meta tags for SEO & Accessibility
 * @param {string} title Page title string
 */
export const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - STREAMFLIX` : 'STREAMFLIX - Watch Movies & TV Shows';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
