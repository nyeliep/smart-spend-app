import { createContext } from 'react';
export const AuthContext = createContext({
    currentUser: null,
    userProfile: null,
    loading: true,
});
