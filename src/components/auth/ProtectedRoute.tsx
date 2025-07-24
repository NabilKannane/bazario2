'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireVerification?: boolean;
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
}

type VendorInfo = {
  isApproved?: boolean;
  // add other vendor-specific properties if needed
};

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  avatar?: string;
  vendorInfo?: VendorInfo;
};

type SessionType = {
  user: SessionUser;
  // add other session properties if needed
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireVerification = false,
  fallbackPath = '/auth/signin',
  loadingComponent,
  unauthorizedComponent,
}) => {
  const { data: session, status } = useSession() as { data: SessionType | null, status: string };
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') {
        return; // Attendre que la session soit chargée
      }

      // Si pas de session et une route protégée
      if (status === 'unauthenticated') {
        console.log('🔒 User not authenticated, redirecting to signin');
        router.push(`${fallbackPath}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      // Si session existe, vérifier les permissions
      if (session?.user) {
        const userRole = session.user.role;
        const isVerified = session.user.isVerified;

        console.log('🔍 Checking access for user:', {
          email: session.user.email,
          role: userRole,
          isVerified,
          allowedRoles,
          requireVerification
        });

        // Vérifier si le rôle est autorisé
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          console.log('❌ Access denied: Role not allowed');
          setAccessDenied(true);
          setIsChecking(false);
          return;
        }

        // Vérifier si la vérification est requise
        if (requireVerification && !isVerified) {
          console.log('❌ Access denied: Account not verified');
          router.push('/auth/verify-email');
          return;
        }

        // Vérifications spéciales pour les vendeurs
        if (session?.user?.role === 'vendor') {
        const isApproved = session.user.vendorInfo?.isApproved;

        if (!isApproved) {
            console.log('❌ Vendor not approved yet');
            router.push('/dashboard/vendor/pending-approval');
            return;
        }
        }


        console.log('✅ Access granted');
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [session, status, router, allowedRoles, requireVerification, fallbackPath]);

  // Composant de chargement
  const LoadingComponent = loadingComponent || (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Vérification des accès...
        </h2>
        <p className="text-gray-600">
          Merci de patienter pendant que nous vérifions vos permissions.
        </p>
      </motion.div>
    </div>
  );

  // Composant d'accès refusé
  const UnauthorizedComponent = unauthorizedComponent || (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Accès Refusé
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-800 font-medium">Permissions insuffisantes</p>
              </div>
              <p className="text-red-700 text-sm">
                Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Votre rôle :</strong> {session?.user?.role || 'Non défini'}</p>
              {allowedRoles.length > 0 && (
                <p><strong>Rôles autorisés :</strong> {allowedRoles.join(', ')}</p>
              )}
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.back()}
                className="w-full"
              >
                Retour à la page précédente
              </Button>
              
              <div className="flex space-x-3">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Accueil
                  </Button>
                </Link>
                
                {session?.user?.role === 'buyer' && (
                  <Link href="/dashboard/buyer" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Mon Dashboard
                    </Button>
                  </Link>
                )}
                
                {session?.user?.role === 'vendor' && (
                  <Link href="/dashboard/vendor" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Mon Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  // États de rendu
  if (status === 'loading' || isChecking) {
    return LoadingComponent;
  }

  if (accessDenied) {
    return UnauthorizedComponent;
  }

  // Si tout est bon, rendre les enfants
  return <>{children}</>;
};

export default ProtectedRoute;
