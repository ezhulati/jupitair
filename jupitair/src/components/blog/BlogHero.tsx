/**
 * Enterprise Blog Hero Component for Jupitair HVAC
 * Features: Responsive design, emergency indicators, performance optimized
 */
import React, { useState, useEffect } from 'react';

interface BlogHeroProps {
  title: string;
  description: string;
  category: string;
  author: string;
  publishDate: Date;
  updateDate?: Date;
  readingTime: number;
  heroImage?: string;
  heroImageAlt?: string;
  isEmergency?: boolean;
}

const BlogHero: React.FC<BlogHeroProps> = ({
  title,
  description,
  category,
  author,
  publishDate,
  updateDate,
  readingTime,
  heroImage,
  heroImageAlt,
  isEmergency = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const publishedDate = formatDate(publishDate);
  const updatedDate = updateDate ? formatDate(updateDate) : null;

  // Preload hero image
  useEffect(() => {
    if (heroImage) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = heroImage;
    }
  }, [heroImage]);

  return (
    <section className="blog-hero-container relative py-16 lg:py-24 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="blog-hero-pattern" />
      
      {/* Emergency Badge */}
      {isEmergency && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Emergency Content
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Content Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-blue-100">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li className="text-blue-200">/</li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li className="text-blue-200">/</li>
                <li>
                  <a 
                    href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="hover:text-white transition-colors"
                  >
                    {category}
                  </a>
                </li>
              </ol>
            </nav>
            
            {/* Category Badge */}
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                isEmergency 
                  ? 'bg-red-500/20 text-red-100 border border-red-400/30' 
                  : 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
              }`}>
                {category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="blog-heading-1 text-white mb-6 drop-shadow-lg">
              {title}
            </h1>
            
            {/* Description */}
            <p className="blog-body text-blue-50 mb-8 leading-relaxed drop-shadow-sm">
              {description}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100">
              {/* Author */}
              <div className="flex items-center gap-2">
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                </svg>
                <span>{author}</span>
              </div>
              
              {/* Date */}
              <div className="flex items-center gap-2">
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
                    clipRule="evenodd"
                  />
                </svg>
                <time dateTime={publishDate.toISOString()}>
                  {updatedDate ? `Updated ${updatedDate}` : publishedDate}
                </time>
              </div>
              
              {/* Reading Time */}
              <div className="flex items-center gap-2">
                <svg 
                  className="w-5 h-5" 
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
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image Column */}
          {heroImage && (
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="relative">
                {/* Loading skeleton */}
                {!imageLoaded && !imageError && (
                  <div className="skeleton w-full h-64 lg:h-80 rounded-2xl"></div>
                )}
                
                {/* Error fallback */}
                {imageError && (
                  <div className="w-full h-64 lg:h-80 bg-white/10 rounded-2xl border-2 border-white/20 flex items-center justify-center">
                    <div className="text-center text-white/70">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-sm">Image unavailable</p>
                    </div>
                  </div>
                )}
                
                {/* Hero Image */}
                {imageLoaded && (
                  <img
                    src={heroImage}
                    alt={heroImageAlt || title}
                    className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-2xl transition-opacity duration-300"
                    loading="eager"
                    decoding="async"
                  />
                )}
                
                {/* Image overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default BlogHero;