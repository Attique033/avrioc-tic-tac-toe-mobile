import React, {createContext, ReactNode, useContext} from 'react';
import {LoginUserRequest, RegisterUserRequest} from '../types';
import {useAuthActions} from '../store/auth/useAuthActions';
import {useAppSelector} from '../store';

type AuthContextType = {
  isAuthenticated: boolean;
  loginUser: (params: LoginUserRequest) => void;
  registerUser: (params: RegisterUserRequest) => void;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const {loginUser, registerUser, logoutUser} = useAuthActions();
  const {isAuthenticated} = useAppSelector(state => state.auth);

  return (
    <AuthContext.Provider
      value={{isAuthenticated, loginUser, registerUser, logoutUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
