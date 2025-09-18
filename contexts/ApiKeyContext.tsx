import React, { ReactNode } from 'react';

// This context is not currently used in the application.
// The Gemini API is accessed via a secure backend function,
// so a user-provided key is not necessary.

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useApiKey = () => {
  // Return a default state that indicates the key is "set" to avoid breaking
  // any potential leftover logic, while ensuring no UI prompts for a key.
  return {
      apiKey: 'backend-configured',
      isApiKeySet: true,
      setApiKey: () => {},
  };
};
