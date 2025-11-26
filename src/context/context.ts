import { createContext } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '../types';

interface AuthContextType {
  currentUser: Partial<FirebaseUser> | null;  
  userProfile: Partial<User> | null;          
  loading: boolean;
}
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
});