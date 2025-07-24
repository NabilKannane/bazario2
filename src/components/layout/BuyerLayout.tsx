'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Navigation pour les acheteurs
const navigation = [
  { name: 'Tableau de bord', href: '/dashboard/buyer', icon: User },
  { name: 'Mes commandes', href: '/dashboard/buyer/orders', icon: Package },
  { name: 'Liste de souhaits', href: '/dashboard/buyer/wishlist', icon: Heart },
  { name: 'Messages', href: '/dashboard/buyer/messages', icon: MessageSquare },
  { name: 'Paramètres', href: '/dashboard/buyer/settings', icon: Settings },
];

const BuyerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <div className="absolute inset-0 bg-gray-600 opacity-75" />
              </motion.div>

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="text-xl font-bold text-orange-500">
                    Bazario
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-orange-100 text-orange-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <button
                      onClick={handleSignOut}
                      className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Déconnexion
                    </button>
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Sidebar desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-6 py-4 border-b">
              <Link href="/" className="text-2xl font-bold text-orange-500">
                Bazario
              </Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-orange-100 text-orange-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Header */}
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

            {/* Barre de recherche */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Rechercher des créations..."
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Actions header */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500">
                  3
                </Badge>
              </Button>

              {/* Explorer marketplace */}
              <Link href="/marketplace">
                <Button size="sm">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Explorer
                </Button>
              </Link>

              {/* Avatar */}
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BuyerLayout;