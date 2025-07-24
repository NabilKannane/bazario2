import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';

interface UseAuthRedirectOptions {
  requiredRole?: string | string[];
  requireVerification?: boolean;
  requireApproval?: boolean; // Pour les vendeurs
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const {
    requiredRole,
    requireVerification = false,
    requireApproval = false,
    redirectTo = '/auth/signin',
    onUnauthorized,
  } = options;

  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (!user) return;

    // Vérifier le rôle
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(user.role)) {
        onUnauthorized?.();
        // Rediriger vers le dashboard approprié
        switch (user.role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'vendor':
            router.push('/dashboard/vendor');
            break;
          case 'buyer':
            router.push('/dashboard/buyer');
            break;
          default:
            router.push('/');
        }
        return;
      }
    }

    // Vérifier la vérification email
    if (requireVerification && !user.isVerified) {
      router.push('/auth/verify-email');
      return;
    }

    // Vérifier l'approbation vendeur
    if (requireApproval && user.role === 'vendor' && !user.vendorInfo?.isApproved) {
      router.push('/dashboard/vendor/pending-approval');
      return;
    }
  }, [user, isLoading, isAuthenticated, router, requiredRole, requireVerification, requireApproval, redirectTo, onUnauthorized]);

  return {
    isAuthorized: isAuthenticated && user !== null,
    user,
    isLoading,
  };
};