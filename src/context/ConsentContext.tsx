import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ConsentPreferences {
  necessary: boolean;
  googleMaps: boolean;
  simplyBook: boolean;
}

export type ConsentService = 'googleMaps' | 'simplyBook';

interface ConsentContextType {
  preferences: ConsentPreferences;
  hasInteracted: boolean;
  isBannerVisible: boolean;
  isModalOpen: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  savePreferences: (custom: Partial<ConsentPreferences>) => void;
  grantServiceConsent: (service: ConsentService) => void;
  openModal: () => void;
  closeModal: () => void;
}

const STORAGE_KEY = 'phi_consent_settings_v1';

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  googleMaps: false,
  simplyBook: false,
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const ConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_PREFERENCES);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Initial load from localStorage on client side
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.preferences === 'object') {
          setPreferences({
            necessary: true,
            googleMaps: Boolean(parsed.preferences.googleMaps),
            simplyBook: Boolean(parsed.preferences.simplyBook),
          });
          setHasInteracted(true);
          setIsBannerVisible(false);
          return;
        }
      }
    } catch {
      // localStorage may fail in restricted/private modes
    }

    // If no stored preferences found, show banner after a tiny delay for smooth hydration
    const timer = setTimeout(() => {
      setIsBannerVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const persist = (newPrefs: ConsentPreferences) => {
    const finalPrefs: ConsentPreferences = {
      ...newPrefs,
      necessary: true,
    };
    setPreferences(finalPrefs);
    setHasInteracted(true);
    setIsBannerVisible(false);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          timestamp: new Date().toISOString(),
          preferences: finalPrefs,
        })
      );
    } catch {
      // Ignore write errors
    }
  };

  const acceptAll = () => {
    persist({
      necessary: true,
      googleMaps: true,
      simplyBook: true,
    });
    setIsModalOpen(false);
  };

  const acceptNecessary = () => {
    persist({
      necessary: true,
      googleMaps: false,
      simplyBook: false,
    });
    setIsModalOpen(false);
  };

  const savePreferences = (custom: Partial<ConsentPreferences>) => {
    persist({
      necessary: true,
      googleMaps: Boolean(custom.googleMaps),
      simplyBook: Boolean(custom.simplyBook),
    });
    setIsModalOpen(false);
  };

  const grantServiceConsent = (service: ConsentService) => {
    const updated: ConsentPreferences = {
      ...preferences,
      [service]: true,
      necessary: true,
    };
    persist(updated);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ConsentContext.Provider
      value={{
        preferences,
        hasInteracted,
        isBannerVisible,
        isModalOpen,
        acceptAll,
        acceptNecessary,
        savePreferences,
        grantServiceConsent,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = (): ConsentContextType => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};
