import React from 'react';
interface CustomLoadingImageProps {
  src: string;
  alt: string;
}

const CustomLoadingImage: React.FC<CustomLoadingImageProps> = ({ src, alt }) => {

  return (
    <div className='w-full min-h-[250px] flex justify-center items-center'>
      <img
        src={src}
        alt={alt}
        // loading='lazy'
      />
    </div>
  );
};

export default CustomLoadingImage;