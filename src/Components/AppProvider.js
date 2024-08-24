import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [useAlternativeUI, setUseAlternativeUI] = useState(false);

  return (
    <AppContext.Provider value={{ 
      selectedItem, 
      setSelectedItem, 
      useAlternativeUI, 
      setUseAlternativeUI 
    }}>
      {children}
    </AppContext.Provider>
  );
};