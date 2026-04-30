import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Federation } from '../types';
import api from '../services/api';

interface FederationContextType {
  federation: Federation | null;
  isLoading: boolean;
  setFederation: (federation: Federation) => void;
  clearFederation: () => void;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
}

const defaultTheme = {
  primaryColor: '#10B981',
  secondaryColor: '#059669',
};

const FederationContext = createContext<FederationContextType | undefined>(undefined);

export function FederationProvider({ children }: { children: ReactNode }) {
  const [federation, setFederationState] = useState<Federation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Apply CSS variables for theming
    if (federation) {
      document.documentElement.style.setProperty('--primary-color', federation.couleur_primaire || defaultTheme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', federation.couleur_secondaire || defaultTheme.secondaryColor);
    } else {
      document.documentElement.style.setProperty('--primary-color', defaultTheme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', defaultTheme.secondaryColor);
    }
  }, [federation]);

  const setFederation = (fed: Federation) => {
    setFederationState(fed);
  };

  const clearFederation = () => {
    setFederationState(null);
  };

  // const loadFederationBySlug = async (slug: string) => {
  //   setIsLoading(true);
  //   try {
  //     const fed = await api.getFederationBySlug(slug);
  //     setFederationState(fed);
  //   } catch (error) {
  //     console.error('Failed to load federation:', error);
  //     setFederationState(null);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <FederationContext.Provider
      value={{
        federation,
        isLoading,
        setFederation,
        clearFederation,
        theme: {
          primaryColor: federation?.couleur_primaire || defaultTheme.primaryColor,
          secondaryColor: federation?.couleur_secondaire || defaultTheme.secondaryColor,
        },
      }}
    >
      {children}
    </FederationContext.Provider>
  );
}

export function useFederation() {
  const context = useContext(FederationContext);
  if (context === undefined) {
    throw new Error('useFederation must be used within a FederationProvider');
  }
  return context;
}

export { FederationContext };
