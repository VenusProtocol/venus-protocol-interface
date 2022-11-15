import noop from 'noop-ts';
import React from 'react';

export interface IncludeXvsContextValue {
  includeXvs: boolean;
  setIncludeXvs: (updatedValue: boolean) => void;
}

export const IncludeXvsContext = React.createContext<IncludeXvsContextValue>({
  includeXvs: true,
  setIncludeXvs: noop,
});

export const IncludeXvsProvider: React.FC = ({ children }) => {
  const [includeXvs, setIncludeXvs] = React.useState(true);

  return (
    <IncludeXvsContext.Provider
      value={{
        includeXvs,
        setIncludeXvs,
      }}
    >
      {children}
    </IncludeXvsContext.Provider>
  );
};
