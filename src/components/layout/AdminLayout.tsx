'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Shield,
  Menu,
  X,
  Bell,
  LogOut,
  User
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Navigation pour les administrateurs
  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      badge: null,
    }
    ,
    {
      name: 'Boutique Bazario',
      href: '/admin/boutique',
      icon: Store,
      badgeColor: 'bg-yellow-500',
    },
    {
      name: 'Utilisateurs',
      href: '/admin/users',
      icon: Users,
      badge: '12',
    },
    {
      name: 'Vendeurs',
      href: '/admin/vendors',
      icon: Store,
      badge: '3',
      badgeColor: 'bg-orange-500',
    }
  ];

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar Desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-gray-900 pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Bazario Admin</h2>
                  <p className="text-xs text-gray-300">Administration</p>
                </div>
              </Link>
            </div>

            {/* Profil admin */}
            <div className="px-4 mb-6">
              <div className="flex items-center p-3 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-300">Administrateur</p>
                </div>
              </div>
            </div>

            {/* Navigation principale */}
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActiveLink(item.href)
                      ? "bg-red-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActiveLink(item.href) ? "text-white" : "text-gray-400 group-hover:text-white"
                    )}
                  />
                  {item.name}
                  {item.badge && (
                    <Badge 
                      className={cn(
                        "ml-auto text-xs",
                        item.badgeColor || "bg-gray-500"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            {/* Déconnexion */}
            <div className="px-2 pt-4 border-t border-gray-700">
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-gray-900 z-50 lg:hidden">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                <Link href="/" className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-white">Admin</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Contenu identique à la sidebar desktop */}
              <div className="flex-1 overflow-y-auto pt-5 pb-4">
                <div className="px-4 mb-6">
                  <div className="flex items-center p-3 bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-300">Administrateur</p>
                    </div>
                  </div>
                </div>

                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        isActiveLink(item.href)
                          ? "bg-red-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          isActiveLink(item.href) ? "text-white" : "text-gray-400"
                        )}
                      />
                      {item.name}
                      {item.badge && (
                        <Badge className={cn("ml-auto text-xs", item.badgeColor || "bg-gray-500")}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>

                <div className="px-2 pt-4 border-t border-gray-700 mt-4">
                  <button
                    onClick={handleSignOut}
                    className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Header mobile */}
        <div className="lg:pl-64">
          <div className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>

            {/* Breadcrumb */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    <li>
                      <Link href="/admin" className="text-gray-400 hover:text-gray-500">
                        Admin
                      </Link>
                    </li>
                    {pathname !== '/admin' && (
                      <>
                        <span className="text-gray-400">/</span>
                        <li className="text-gray-900 font-medium">
                          {(() => {
                            const segments = pathname.split('/').filter(Boolean);
                            const lastSegment = segments[segments.length - 1] || '';
                            return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
                          })()}
                        </li>
                      </>
                    )}
                  </ol>
                </nav>
              </div>
            </div>

            {/* Actions header */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">

              {/* Retour au site */}
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Store className="w-4 h-4 mr-2" />
                  Voir le site
                </Button>
              </Link>

              {/* Avatar */}
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <main className="py-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;