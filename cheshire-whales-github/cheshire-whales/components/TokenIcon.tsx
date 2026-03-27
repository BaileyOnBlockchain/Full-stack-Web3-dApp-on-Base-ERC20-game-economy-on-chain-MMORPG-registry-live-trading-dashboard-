"use client";
import Image from "next/image";
import { useState } from "react";

interface TokenIconProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackIcon?: string;
}

export default function TokenIcon({ 
  src, 
  alt, 
  width, 
  height, 
  className = "",
  fallbackIcon = "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
}: TokenIconProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackIcon);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={false}
      unoptimized={false}
    />
  );
}
