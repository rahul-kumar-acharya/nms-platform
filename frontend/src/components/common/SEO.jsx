import React, { useEffect } from 'react';

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath = '',
  ogType = 'website',
  ogImage = 'https://nms.acharyaworks.in/og-image.jpg',
}) {
  useEffect(() => {
    // 1. Dynamic Title Tag
    const fullTitle = title 
      ? `${title} | NMS Platform` 
      : 'NMS Platform - Best Enterprise Network Management System';
    document.title = fullTitle;

    // Helper to update meta tag content
    const updateMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(attrName.replace(/["']/g, ''), attrVal.replace(/["']/g, ''));
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 2. Primary Meta Tags
    if (description) {
      updateMetaTag('meta[name="description"]', 'content', description);
      updateMetaTag('meta[property="og:description"]', 'content', description);
      updateMetaTag('meta[property="twitter:description"]', 'content', description);
    }

    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'content', keywords);
    }

    // 3. OpenGraph & Twitter Title Tags
    updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
    updateMetaTag('meta[property="twitter:title"]', 'content', fullTitle);
    updateMetaTag('meta[property="og:type"]', 'content', ogType);
    updateMetaTag('meta[property="og:image"]', 'content', ogImage);

    // 4. Canonical URL Link Tag
    const baseUrl = 'https://nms.acharyaworks.in';
    const fullCanonicalUrl = `${baseUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

  }, [title, description, keywords, canonicalPath, ogType, ogImage]);

  return null;
}
