'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Extend the Window interface to include jQuery
declare global {
  interface Window {
    jQuery: unknown;
  }
}

const ScriptLoader = () => {
  const pathname = usePathname();

  useEffect(() => {
    const scriptId = 'main-script';

    const loadScript = () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '/assets/js/main.js';
      script.defer = true; // Use defer to ensure it executes after the document is parsed
      document.body.appendChild(script);
    };

    // Check if jQuery is available before loading the main script
    const checkJQuery = () => {
      if (window.jQuery) {
        loadScript();
      } else {
        setTimeout(checkJQuery, 50); // Check again after a short delay
      }
    };

    checkJQuery();

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [pathname]);

  return null;
};

export default ScriptLoader;
