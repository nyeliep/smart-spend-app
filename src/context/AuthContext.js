import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { onAuthChange, getUserProfile } from '../services/auth';
import { AuthContext } from './context';
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    const profile = await getUserProfile(user.uid);
                    setUserProfile(profile);
                }
                catch {
                    setUserProfile(null);
                }
            }
            else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    return (_jsx(AuthContext.Provider, { value: { currentUser, userProfile, loading }, children: children }));
};
