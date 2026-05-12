import { AdvancedImage, placeholder, responsive } from '@cloudinary/react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import cld, { getPublicIdFromUrl } from '../utils/cloudinary';

const CldImage = ({ src, alt, className, ...props }) => {
  const publicId = getPublicIdFromUrl(src);

  if (!publicId) {
    // Fallback for non-cloudinary images
    return (
      <LazyLoadComponent>
        <img 
          src={src} 
          alt={alt} 
          className={`${className} block`} 
          {...props} 
        />
      </LazyLoadComponent>
    );
  }

  // 1. Generate Highly Optimized Cloudinary Image object
  const myImage = cld.image(publicId)
    .format('auto')
    .quality('auto');

  return (
    <LazyLoadComponent>
      <AdvancedImage
        cldImg={myImage}
        className={`${className} block`}
        plugins={[
          responsive({ steps: [200, 400, 600, 800, 1000, 1200] }), // Professional Responsive handling
          placeholder({ mode: 'blur' }) // Cloudinary's native blur-up placeholder
        ]}
        alt={alt}
        {...props}
      />
    </LazyLoadComponent>
  );
};

export default CldImage;
