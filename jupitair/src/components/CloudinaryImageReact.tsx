import React, { useState, useEffect } from 'react';
import { AdvancedImage, lazyload, responsive, placeholder } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { format } from '@cloudinary/url-gen/actions/delivery';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { blur } from '@cloudinary/url-gen/actions/effect';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  preset?: 'hero' | 'thumbnail' | 'blogFeatured' | 'serviceIcon' | 'teamMember';
  className?: string;
  loading?: 'lazy' | 'eager';
  responsive?: boolean;
  onClick?: () => void;
}

const CloudinaryImageReact: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  preset = 'thumbnail',
  className = '',
  loading = 'lazy',
  responsive = true,
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize Cloudinary
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dwnmuolg8'
    }
  });
  
  // Define preset configurations
  const presets = {
    hero: { width: 1920, height: 1080, quality: 'auto:best' },
    thumbnail: { width: 400, height: 300, quality: 'auto:good' },
    blogFeatured: { width: 1200, height: 630, quality: 'auto:best' },
    serviceIcon: { width: 200, height: 200, quality: 'auto:good' },
    teamMember: { width: 300, height: 300, quality: 'auto:good' }
  };
  
  const config = presets[preset];
  
  // Create the Cloudinary image with transformations
  const myImage = cld.image(src)
    .format('auto')
    .quality(config.quality as any)
    .resize(
      fill()
        .width(config.width)
        .height(config.height)
        .gravity(autoGravity())
    );
  
  // Create placeholder with blur
  const placeholderImage = cld.image(src)
    .format('auto')
    .quality('auto:low')
    .resize(scale().width(20))
    .effect(blur().strength(1000));
  
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);
  
  const plugins = [];
  if (loading === 'lazy') {
    plugins.push(lazyload());
  }
  if (responsive) {
    plugins.push(responsive());
    plugins.push(placeholder());
  }
  
  return (
    <div 
      className={`cloudinary-wrapper ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {!isLoaded && loading === 'lazy' && (
        <img
          src={placeholderImage.toURL()}
          alt={alt}
          className="cloudinary-placeholder"
          style={{
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      
      <AdvancedImage
        cldImg={myImage}
        plugins={plugins}
        onLoad={() => setIsLoaded(true)}
        className={`cloudinary-image ${isLoaded ? 'loaded' : 'loading'}`}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
        alt={alt}
      />
    </div>
  );
};

export default CloudinaryImageReact;