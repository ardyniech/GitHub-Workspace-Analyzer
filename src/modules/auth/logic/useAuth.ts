import { useState, useEffect } from 'react';
import { authStorage } from '../storage/local';
import { dispatcher } from '../../../core/dispatcher';

export function useAuth() {
  const [token, setToken] = useState<string | null>(authStorage.getToken());
  const [username, setUsername] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const unsub = dispatcher.on('AUTH_STATE_CHANGED', (newToken) => {
      setToken(newToken);
    });

    if (token) {
      validateToken(token);
    }

    return unsub;
  }, [token]);

  const validateToken = async (tk: string) => {
    setIsValidating(true);
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${tk}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsername(data.login);
      } else {
        authStorage.clearToken();
        dispatcher.emit('AUTH_STATE_CHANGED', null);
        setUsername(null);
      }
    } catch (e) {
      console.error('[Module:Auth] Error validating token:', e);
    } finally {
      setIsValidating(false);
    }
  };

  const login = (newToken: string) => {
    authStorage.saveToken(newToken);
    dispatcher.emit('AUTH_STATE_CHANGED', newToken);
  };

  const logout = () => {
    authStorage.clearToken();
    dispatcher.emit('AUTH_STATE_CHANGED', null);
    setUsername(null);
  };

  return {
    token,
    username,
    isLoggedIn: !!token,
    isValidating,
    login,
    logout,
  };
}
