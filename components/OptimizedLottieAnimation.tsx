"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { useInView } from "react-intersection-observer";

interface OptimizedLottieAnimationProps {
  src: string;
  fallbackImage: string;
  className?: string;
}

const OptimizedLottieAnimation: React.FC<OptimizedLottieAnimationProps> = ({
  src,
  fallbackImage,
  className,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleError = () => {
    console.error("Failed to load Lottie animation");
    setHasError(true);
  };

  if (!isOnline || hasError) {
    return (
      <img
        src={fallbackImage || "/placeholder.svg"}
        alt="Fallback"
        className={className}
      />
    );
  }

  return (
    <div ref={ref} className={className}>
      {inView && (
        <DotLottiePlayer
          src={src}
          loop
          autoplay
          onError={handleError}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default OptimizedLottieAnimation;
