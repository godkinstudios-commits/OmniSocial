import React, { useEffect, useState } from 'react';
import { DownloadIcon } from './Icons';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <DownloadIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Install OmniPost</h3>
          <p className="text-xs text-blue-100">Add to home screen for the best experience</p>
        </div>
      </div>
      <button 
        onClick={handleInstall}
        className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
      >
        Install
      </button>
    </div>
  );
};
