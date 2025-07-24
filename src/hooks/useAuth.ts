import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IUser } from '@/models/User';

// Types pour les hooks d'authentification
interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'vendor' | 'buyer';
  avatar?: string;
  isVerified: boolean;
  profile?: IUser['profile'];
  vendorInfo?: IUser['vendorInfo'];
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface UseVendorAuthReturn extends UseAuthReturn {
  isApproved: boolean;
  businessName?: string;
  specialties?: string[];
  rating?: number;
  totalSales?: number;
}

interface UseBuyerAuthReturn extends UseAuthReturn {
  // Propriétés spécifiques aux acheteurs peuvent être ajoutées ici
}

interface UseAdminAuthReturn extends UseAuthReturn {
  // Propriétés spécifiques aux admins peuvent être ajoutées ici
}

// Hook d'authentification de base
export const useAuth = (): UseAuthReturn => {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const user: AuthUser | null = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    firstName: (session.user as any).firstName ?? '',
    lastName: (session.user as any).lastName ?? '',
    role: session.user.role as 'admin' | 'vendor' | 'buyer',
    avatar: session.user.avatar,
    isVerified: session.user.isVerified,
    profile: (session.user as any).profile,
    vendorInfo: (session.user as any).vendorInfo,
  } : null;

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    error,
  };
};

// Hook spécifique pour les vendeurs
export const useVendorAuth = (): UseVendorAuthReturn => {
  const { user, isLoading, isAuthenticated, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role !== 'vendor') {
        console.log('❌ User is not a vendor, redirecting...');
        router.push('/dashboard/buyer');
        return;
      }

      if (!user?.isVerified) {
        console.log('❌ Vendor account not verified');
        router.push('/auth/verify-email');
        return;
      }

      if (user?.vendorInfo && !user.vendorInfo.isApproved) {
        console.log('❌ Vendor not approved yet');
        router.push('/dashboard/vendor/pending-approval');
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    isApproved: user?.vendorInfo?.isApproved || false,
    businessName: user?.vendorInfo?.businessName,
    specialties: user?.vendorInfo?.specialties,
    rating: user?.vendorInfo?.rating,
    totalSales: user?.vendorInfo?.totalSales,
  };
};

// Hook spécifique pour les acheteurs
export const useBuyerAuth = (): UseBuyerAuthReturn => {
  const { user, isLoading, isAuthenticated, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'buyer') {
      console.log('❌ User is not a buyer, redirecting...');
      if (user?.role === 'vendor') {
        router.push('/dashboard/vendor');
      } else if (user?.role === 'admin') {
        router.push('/admin');
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
  };
};

// Hook spécifique pour les administrateurs
export const useAdminAuth = (): UseAdminAuthReturn => {
  const { user, isLoading, isAuthenticated, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      console.log('❌ User is not an admin, redirecting...');
      if (user?.role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/buyer');
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
  };
};

// Hook pour vérifier des permissions spécifiques
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const isVerified = (): boolean => {
    return user?.isVerified || false;
  };

  const isApprovedVendor = (): boolean => {
    return user?.role === 'vendor' && user?.vendorInfo?.isApproved === true;
  };

  const canAccessVendorDashboard = (): boolean => {
    return hasRole('vendor') && isVerified() && isApprovedVendor();
  };

  const canAccessBuyerDashboard = (): boolean => {
    return hasRole('buyer');
  };

  const canAccessAdminDashboard = (): boolean => {
    return hasRole('admin') && isVerified();
  };

  const canManageProducts = (): boolean => {
    return canAccessVendorDashboard();
  };

  const canManageOrders = (): boolean => {
    return canAccessVendorDashboard();
  };

  const canViewAnalytics = (): boolean => {
    return hasRole(['vendor', 'admin']);
  };

  return {
    hasRole,
    isVerified,
    isApprovedVendor,
    canAccessVendorDashboard,
    canAccessBuyerDashboard,
    canAccessAdminDashboard,
    canManageProducts,
    canManageOrders,
    canViewAnalytics,
  };
};

// Hook pour la redirection intelligente basée sur le rôle
export const useRoleRedirect = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const redirectToAppropriateSection = () => {
    if (isLoading || !user) return;

    switch (user.role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'vendor':
        if (!user.isVerified) {
          router.push('/auth/verify-email');
        } else if (!user.vendorInfo?.isApproved) {
          router.push('/dashboard/vendor/pending-approval');
        } else {
          router.push('/dashboard/vendor');
        }
        break;
      case 'buyer':
        router.push('/dashboard/buyer');
        break;
      default:
        router.push('/');
    }
  };

  return { redirectToAppropriateSection };
};

// Hook pour gérer l'état de session étendu
export const useSessionExtended = () => {
  const { data: session, status, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshSession = async () => {
    setIsRefreshing(true);
    try {
      await update();
    } catch (error) {
      console.error('Failed to refresh session:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getSessionInfo = () => {
    if (!session) return null;

    return {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      isVerified: session.user.isVerified,
      sessionExpiry: session.expires,
    };
  };

  return {
    session,
    status,
    isRefreshing,
    refreshSession,
    getSessionInfo,
  };
};
