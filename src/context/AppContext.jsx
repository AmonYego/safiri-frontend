import { createContext, useContext } from 'react';

// Create a context to hold global app state that can be accessed by any component.
export const AppContext = createContext(null);

// Create a custom hook that provides a shorthand for using the AppContext.
export const useAppContext = () => useContext(AppContext);
