'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  requireVerification?: boolean;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = null,
  requireVerification = false,
}) => {
  const { data: session } = useSession();

  if (!session?.user) {
    return <>{fallback}</>;
  }

  const userRole = session.user.role;
  const isVerified = session.user.isVerified;

  // Vérifier le rôle
  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  // Vérifier la vérification si requise
  if (requireVerification && !isVerified) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export { RoleGuard };