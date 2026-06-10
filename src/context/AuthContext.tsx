import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { db, initializeDatabase, type UserRole } from '../lib/storage';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  companyId: string | null;
  companyName: string | null;
  isActive: boolean;
}

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    initializeDatabase();
    (async () => {
      const session = await db.getSession();
      if (session) {
        setState({ user: { id: session.id || '', email: session.email || '', name: session.name || '', role: session.role || 'colaborador', avatar: session.avatar || '', companyId: session.companyId || '', companyName: session.companyName || '', isActive: session.isActive ?? true }, isAuthenticated: true, isLoading: false });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, isLoading: true }));

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 600));

    const u = await db.login(email, password);

    if (u) {
      setState({
        user: { id: u.id, email: u.email, name: u.name, role: u.role, avatar: u.avatar, companyId: u.companyId, companyName: u.companyName, isActive: u.isActive },
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }

    setState(prev => ({ ...prev, isLoading: false }));
    return { success: false, error: 'E-mail ou senha incorretos' };
  }, []);

  const logout = useCallback(async () => {
    await db.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
