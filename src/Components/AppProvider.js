
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <AppContext.Provider value={{ selectedItem, setSelectedItem }}>
            {children}
        </AppContext.Provider>
    );
};
