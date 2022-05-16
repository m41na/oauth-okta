import { createContext } from 'react';
import authState from './useAuthState';

export const AppContext = createContext({});

export default ({ children }) => {

    const { auth, login, logout, onAuthSuccess, setAuthError } = authState();

    return (
        <AppContext.Provider value={{ auth, login, logout, onAuthSuccess, setAuthError }}>
            {children}
        </AppContext.Provider>
    )
}