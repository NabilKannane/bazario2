'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  User,
  Menu,
  X,
  Bell,
  HelpCircle,
  LogOut,
  Store,
  MessageSquare
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface VendorLayoutProps {
  children: React.ReactNode;
}

const VendorLayout: React.FC<VendorLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Debug en mode développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🏗️ VendorLayout - Session:', {
        status,
        user: session?.user?.email,
        role: session?.user?.role,
        isApproved: session?.user?.vendorInfo?.isApproved,
        pathname
      });
    }
  }, [session, status, pathname]);

  // Navigation pour les vendeurs
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard/vendor',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Mes Produits',
      href: '/dashboard/vendor/products',
      icon: Package,
      badge: '24',
    },
    {
      name: 'Commandes',
      href: '/dashboard/vendor/orders',
      icon: ShoppingCart,
      badge: '3',
      badgeColor: 'bg-red-500',
    },
    {
      name: 'Analytics',
      href: '/dashboard/vendor/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      name: 'Mon Atelier',
      href: '/dashboard/vendor/profile',
      icon: Store,
      badge: null,
    },
    {
      name: 'Messages',
      href: '/dashboard/vendor/messages',
      icon: MessageSquare,
      badge: '2',
      badgeColor: 'bg-blue-500',
    },
  ];

  const secondaryNavigation = [
    {
      name: 'Paramètres',
      href: '/dashboard/vendor/settings',
      icon: Settings,
    },
    {
      name: 'Aide',
      href: '/help',
      icon: HelpCircle,
    },
  ];

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'Nouvelle commande',
      message: 'Marie Dupont a commandé votre vase en céramique',
      time: '5 min',
      read: false,
      type: 'order',
    },
    {
      id: 2,
      title: 'Stock faible',
      message: 'Il ne reste que 2 unités de "Bol en grès émaillé"',
      time: '1h',
      read: false,
      type: 'warning',
    },
    {
      id: 3,
      title: 'Nouveau message',
      message: 'Pierre Martin vous a envoyé un message',
      time: '2h',
      read: true,
      type: 'message',
    },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const isActiveLink = (href: string) => {
    if (href === '/dashboard/vendor') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Si on est sur la page pending-approval, ne pas afficher le layout normal
  if (pathname === '/dashboard/vendor/pending-approval') {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute allowedRoles={['vendor', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar Desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Bazario</h2>
                  <p className="text-xs text-gray-500">Dashboard Vendeur</p>
                </div>
              </Link>
            </div>

            {/* Profil vendeur */}
            <div className="px-4 mb-6">
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.vendorInfo?.businessName || 'Artisan'}
                  </p>
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
                      ? "bg-orange-100 text-orange-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActiveLink(item.href) ? "text-orange-500" : "text-gray-400 group-hover:text-gray-500"
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

            {/* Navigation secondaire */}
            <div className="px-2 space-y-1 border-t border-gray-200 pt-4">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActiveLink(item.href)
                      ? "bg-orange-100 text-orange-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </Link>
              ))}
              
              {/* Déconnexion */}
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 z-50 lg:hidden"
              >
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                  <Link href="/" className="flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold">Bazario</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Contenu identique à la sidebar desktop */}
                <div className="flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="px-4 mb-6">
                    <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session?.user?.vendorInfo?.businessName || 'Artisan'}
                        </p>
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
                            ? "bg-orange-100 text-orange-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "mr-3 h-5 w-5",
                            isActiveLink(item.href) ? "text-orange-500" : "text-gray-400"
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

                  <div className="px-2 space-y-1 border-t border-gray-200 pt-4 mt-4">
                    {secondaryNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                        {item.name}
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
                      <Link href="/dashboard/vendor" className="text-gray-400 hover:text-gray-500">
                        Dashboard
                      </Link>
                    </li>
                    {pathname !== '/dashboard/vendor' && (
                      <>
                        <span className="text-gray-400">/</span>
                        <li className="text-gray-900 font-medium">
                          {(() => {
                            const lastSegment = pathname.split('/').pop() || '';
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
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>

                {/* Dropdown notifications */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer",
                              !notification.read && "bg-blue-50"
                            )}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  il y a {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200">
                        <Link
                          href="/dashboard/vendor/notifications"
                          className="text-sm text-orange-600 hover:text-orange-500 font-medium"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          Voir toutes les notifications
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bouton voir la boutique */}
              <Link href={`/artisans/${session?.user?.id}`}>
                <Button variant="outline" size="sm">
                  <Store className="w-4 h-4 mr-2" />
                  Ma boutique
                </Button>
              </Link>

              {/* Avatar */}
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <main className="py-8">
            {children}
          </main>
        </div>

        {/* Overlay pour fermer les dropdowns */}
        {notificationsOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setNotificationsOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default VendorLayout;