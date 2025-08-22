import { Cloudinary } from '@cloudinary/url-gen';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { fill, scale, fit } from '@cloudinary/url-gen/actions/resize';
import { blur as blurEffect } from '@cloudinary/url-gen/actions/effect';

// Initialize Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwnmuolg8'
  }
});

// Image transformation presets
export const imagePresets = {
  // Hero images - large, high quality
  hero: {
    width: 1920,
    height: 1080,
    quality: 'auto:best',
    format: 'auto',
    crop: 'fill',
    gravity: 'auto'
  },
  
  // Card thumbnails
  thumbnail: {
    width: 400,
    height: 300,
    quality: 'auto:good',
    format: 'auto',
    crop: 'fill',
    gravity: 'auto'
  },
  
  // Blog post featured images
  blogFeatured: {
    width: 1200,
    height: 630,
    quality: 'auto:best',
    format: 'auto',
    crop: 'fill',
    gravity: 'auto'
  },
  
  // Blog inline images
  blogInline: {
    width: 800,
    height: 600,
    quality: 'auto:good',
    format: 'auto',
    crop: 'fit'
  },
  
  // Service icons
  serviceIcon: {
    width: 200,
    height: 200,
    quality: 'auto:good',
    format: 'auto',
    crop: 'fill',
    gravity: 'center'
  },
  
  // Team member photos
  teamMember: {
    width: 300,
    height: 300,
    quality: 'auto:good',
    format: 'auto',
    crop: 'fill',
    gravity: 'face'
  },
  
  // Mobile optimized hero
  mobileHero: {
    width: 768,
    height: 600,
    quality: 'auto:good',
    format: 'auto',
    crop: 'fill',
    gravity: 'auto'
  },
  
  // Open Graph images
  ogImage: {
    width: 1200,
    height: 630,
    quality: 'auto:best',
    format: 'jpg',
    crop: 'fill',
    gravity: 'auto'
  }
};

// Helper function to generate Cloudinary URL with transformations
export function getCloudinaryUrl(
  publicId: string,
  preset: keyof typeof imagePresets = 'thumbnail',
  customTransforms?: any
) {
  const presetConfig = imagePresets[preset];
  
  let image = cld.image(publicId)
    .format(presetConfig.format as any)
    .quality(presetConfig.quality as any);
  
  // Apply resize based on preset
  if (presetConfig.crop === 'fill') {
    image = image.resize(
      fill()
        .width(presetConfig.width)
        .height(presetConfig.height)
        .gravity(autoGravity())
    );
  } else if (presetConfig.crop === 'fit') {
    image = image.resize(
      fit()
        .width(presetConfig.width)
        .height(presetConfig.height)
    );
  }
  
  // Apply custom transformations if provided
  if (customTransforms) {
    image = { ...image, ...customTransforms };
  }
  
  return image.toURL();
}

// Generate responsive image srcset
export function getResponsiveSrcSet(
  publicId: string,
  widths: number[] = [640, 768, 1024, 1280, 1536]
): string {
  return widths
    .map(width => {
      const url = cld.image(publicId)
        .format('auto')
        .quality('auto')
        .resize(scale().width(width))
        .toURL();
      return `${url} ${width}w`;
    })
    .join(', ');
}

// Default image mappings for common site images
export const siteImages = {
  // Logos
  logoColor: 'jupitair/logo-color',
  logoWhite: 'jupitair/logo-white',
  
  // Hero images
  homeHero: 'jupitair/heroes/home-hero',
  servicesHero: 'jupitair/heroes/services-hero',
  aboutHero: 'jupitair/heroes/about-hero',
  contactHero: 'jupitair/heroes/contact-hero',
  
  // Service images
  acRepair: 'jupitair/services/ac-repair',
  heatingRepair: 'jupitair/services/heating-repair',
  hvacInstallation: 'jupitair/services/hvac-installation',
  ductCleaning: 'jupitair/services/duct-cleaning',
  emergencyService: 'jupitair/services/emergency-service',
  maintenance: 'jupitair/services/maintenance',
  
  // City images
  frisco: 'jupitair/cities/frisco',
  plano: 'jupitair/cities/plano',
  mckinney: 'jupitair/cities/mckinney',
  allen: 'jupitair/cities/allen',
  prosper: 'jupitair/cities/prosper',
  theColony: 'jupitair/cities/the-colony',
  littleElm: 'jupitair/cities/little-elm',
  addison: 'jupitair/cities/addison',
  
  // Team
  owner: 'jupitair/team/owner',
  
  // Equipment brands
  carrier: 'jupitair/brands/carrier',
  trane: 'jupitair/brands/trane',
  lennox: 'jupitair/brands/lennox',
  rheem: 'jupitair/brands/rheem',
  goodman: 'jupitair/brands/goodman',
  
  // Certifications
  nate: 'jupitair/certifications/nate',
  epa: 'jupitair/certifications/epa',
  bbb: 'jupitair/certifications/bbb',
  
  // Placeholders
  placeholder: 'jupitair/placeholder',
  avatarPlaceholder: 'jupitair/avatar-placeholder'
};

// Upload image to Cloudinary (for dynamic uploads)
export async function uploadToCloudinary(file: File, folder: string = 'jupitair/uploads') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'jupitair-hvac'); // Create this preset in Cloudinary dashboard
  formData.append('folder', folder);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

// Get optimized image URL with lazy loading support
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    loading?: 'lazy' | 'eager';
    blur?: boolean;
  } = {}
) {
  const {
    width = 800,
    height = 600,
    quality: customQuality = 'auto',
    blur = false
  } = options;
  
  let image = cld.image(publicId)
    .format('auto')
    .quality(customQuality as any)
    .resize(fill().width(width).height(height).gravity(autoGravity()));
  
  // Add blur for lazy loading placeholder
  if (blur) {
    image = image.effect(blurEffect(1000));
  }
  
  return image.toURL();
}

// Generate blur placeholder for lazy loading
export function getBlurPlaceholder(publicId: string) {
  return cld.image(publicId)
    .format('auto')
    .quality('auto:low')
    .resize(scale().width(20))
    .effect(blur(1000))
    .toURL();
}