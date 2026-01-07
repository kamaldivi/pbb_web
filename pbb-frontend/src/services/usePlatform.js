import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Custom hook to detect platform using Capacitor
 * Returns platform information that can be used for conditional rendering
 */
export const usePlatform = () => {
  const [platform, setPlatform] = useState({
    isNative: false,
    isMobile: false,
    isWeb: false,
    isIOS: false,
    isAndroid: false,
    platformName: 'web'
  });

  useEffect(() => {
    const platformName = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    
    setPlatform({
      isNative,
      isMobile: platformName === 'ios' || platformName === 'android',
      isWeb: platformName === 'web',
      isIOS: platformName === 'ios',
      isAndroid: platformName === 'android',
      platformName
    });

    console.log('Platform detected:', platformName);
    console.log('Is native platform:', isNative);
  }, []);

  return platform;
};

export default usePlatform;