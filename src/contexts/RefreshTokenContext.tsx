"use client"

import React from 'react'
import { toast } from 'react-toastify'
import { refreshToken } from 'apis/users.api'

interface RefreshContextType {
  clearAuth: () => void
  isAuthenticated: boolean
  setupTokenRefresh: () => void
}

const refreshContext= React.createContext<RefreshContextType>({
  clearAuth: () => {},
  isAuthenticated: false,
  setupTokenRefresh: () => {}
})

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) =>{
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const intervalRef= React.useRef<NodeJS.Timeout | undefined>(undefined);
  const refreshTokenValue= localStorage.getItem('refreshToken');

  const clearAuth= React.useCallback(() =>{
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, [])
  const refreshAccessToken= React.useCallback(async () =>{
    try {
      if (!refreshTokenValue) {
        clearAuth();
        return;
      }
      const data= await refreshToken(refreshTokenValue);
      localStorage.setItem('authToken', data.access);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error);
      clearAuth();
    }
  }, [clearAuth, refreshTokenValue])
  const setupTokenRefresh= React.useCallback(() =>{
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(refreshAccessToken, 5 * 60 * 1000);
  }, [refreshAccessToken])

  React.useEffect(() =>{
    const accessToken= localStorage.getItem('authToken');
    if (accessToken && refreshTokenValue) {
      setIsAuthenticated(true);
      setupTokenRefresh()
    } else {
      clearAuth();
    }

    return () =>{
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [clearAuth, setupTokenRefresh, refreshTokenValue])

  const value= React.useMemo(() => ({
    clearAuth,
    isAuthenticated,
    setupTokenRefresh
  }), [isAuthenticated, clearAuth, setupTokenRefresh])

  return (
    <refreshContext.Provider value={value}>
      {children}
    </refreshContext.Provider>
  )
}

export const useRefresh= () =>{
  const context= React.useContext(refreshContext);
  if (!context) throw new Error('useRefresh must be used within an AuthProvider');
  return context;
}