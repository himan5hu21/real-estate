import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import cld, { getPublicIdFromUrl } from '../utils/cloudinary';

const CldImage = ({ src, alt, className, width, height, ...props }) => {
  const publicId = getPublicIdFromUrl(src);

  if (!publicId) {
    // Fallback for non-cloudinary images
    return (
      <LazyLoadImage
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        effect="blur"
        {...props}
      />
    );
  }

  // 1. Generate Highly Optimized Main Image URL
  const mainImage = cld.image(publicId)
    .format('auto')
    .quality('auto');
  
  const mainUrl = mainImage.toURL();

  // 2. Generate Tiny Blurred Placeholder URL (Professional 'Blur-up' Technique)
  const placeholderImage = cld.image(publicId)
    .format('auto')
    .quality('auto')
    .resize('w_50,c_scale') // Very small version
    .effect('e_blur:1000'); // Heavily blurred
  
  const placeholderUrl = placeholderImage.toURL();

  return (
    <LazyLoadImage
      src={mainUrl}
      placeholderSrc={placeholderUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
      effect="blur"
      threshold={100} // Start loading slightly before viewport
      wrapperClassName={className} // Ensure wrapper matches for layout stability
      {...props}
    />
  );
};

export default CldImage;
