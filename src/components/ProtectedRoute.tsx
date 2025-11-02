'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Memoize allowedRoles to prevent unnecessary re-runs
  const allowedRolesString = useMemo(
    () => JSON.stringify(allowedRoles.sort()),
    [allowedRoles]
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const userData = await response.json();
          
          // Se não há restrições de role, permitir acesso
          if (allowedRoles.length === 0) {
            setIsAuthorized(true);
            return;
          }
          
          // Verificar se o usuário tem uma das roles permitidas
          if (allowedRoles.includes(userData.role)) {
            setIsAuthorized(true);
          } else {
            // Usuário não tem permissão
            router.push(redirectTo);
          }
        } else {
          // Usuário não autenticado
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedRolesString, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
