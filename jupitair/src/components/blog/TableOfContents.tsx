/**
 * Interactive Table of Contents Component for Jupitair HVAC Blog
 * Features: Auto-generation, smooth scroll, active section highlighting
 */
import React, { useState, useEffect, useCallback } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  isMobile?: boolean;
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  isMobile = false,
  className = ''
}) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  // Generate TOC from high-level headings only (h2, h3)
  useEffect(() => {
    const headings = document.querySelectorAll('h2, h3');
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      let id = heading.id || `heading-${index}`;
      
      // Generate meaningful IDs from heading text if not present
      if (!heading.id) {
        id = text.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .substring(0, 50) || `heading-${index}`;
        heading.id = id;
      }

      items.push({ id, text, level });
    });

    setTocItems(items);
  }, []);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      tocItems.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [tocItems]);

  // Smooth scroll to section
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL without triggering scroll
      if (history.replaceState) {
        history.replaceState(null, '', `#${id}`);
      }

      // Collapse mobile TOC after selection
      if (isMobile) {
        setIsExpanded(false);
      }
    }
  }, [isMobile]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToSection(id);
    }
  }, [scrollToSection]);

  if (tocItems.length === 0) {
    return null;
  }

  const tocContent = (
    <nav 
      aria-label="Table of contents" 
      className={`toc-nav ${className}`}
    >
      <ul className="space-y-0">
        {tocItems.map(({ id, text, level }) => (
          <li key={id}>
            <button
              onClick={() => scrollToSection(id)}
              onKeyDown={(e) => handleKeyDown(e, id)}
              className={`block w-full text-left py-3 px-4 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-l-2 ${
                level === 2 
                  ? 'font-medium' 
                  : 'font-normal text-gray-600 ml-4'
              } ${
                activeId === id
                  ? 'bg-blue-50 text-blue-700 border-blue-500 shadow-sm'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-transparent hover:border-gray-200'
              }`}
              aria-current={activeId === id ? 'true' : 'false'}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  if (isMobile) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          aria-expanded={isExpanded}
          aria-controls="mobile-toc"
        >
          <span className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </div>
            <span>Table of Contents</span>
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        <div
          id="mobile-toc"
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div className="border-t border-gray-100">
            {tocContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg 
              className="w-4 h-4 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </div>
          <span>Table of Contents</span>
        </h3>
      </div>
      
      <div className="p-2">
        {tocContent}
      </div>
      
      {/* Reading progress for desktop */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg 
            className="w-4 h-4" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
              clipRule="evenodd"
            />
          </svg>
          <span>Click to jump to section</span>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;