'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Shield, 
  CreditCard, 
  Truck,
  Globe,
  User,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useForm } from 'react-hook-form';

// Mock data pour les paramètres
const mockSettings = {
  notifications: {
    email: {
      newOrders: true,
      messages: true,
      reviews: false,
      promotions: true,
    },
    push: {
      newOrders: true,
      messages: false,
      reviews: true,
      promotions: false,
    },
  },
  account: {
    email: 'marie.dubois@email.com',
    twoFactorEnabled: false,
  },
  shop: {
    autoAcceptOrders: false,
    vacationMode: false,
    minimumOrderAmount: 0,
    processingTime: '2-3 jours',
  },
  payment: {
    bankAccount: '**** **** **** 1234',
    taxNumber: 'FR12345678901',
    commission: 8.5,
  },
  shipping: {
    freeShippingThreshold: 50,
    standardShippingCost: 5.90,
    expressShippingCost: 12.90,
  },
};

const VendorSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState(mockSettings);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const tabs = [
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'account', name: 'Compte', icon: User },
    { id: 'shop', name: 'Boutique', icon: Globe },
    { id: 'payment', name: 'Paiements', icon: CreditCard },
    { id: 'shipping', name: 'Livraison', icon: Truck },
    { id: 'security', name: 'Sécurité', icon: Shield },
  ];

  const handleNotificationChange = (type: 'email' | 'push', setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: {
          ...prev.notifications[type],
          [setting]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simuler l'enregistrement
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Paramètres sauvegardés !');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600 mt-1">
              Gérez les paramètres de votre compte et boutique
            </p>
          </div>
          <Button onClick={handleSave} loading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation des onglets */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1 p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="mr-3 h-4 w-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contenu des onglets */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3"
        >
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications par email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'newOrders', label: 'Nouvelles commandes', description: 'Recevoir un email pour chaque nouvelle commande' },
                    { key: 'messages', label: 'Nouveaux messages', description: 'Notifications des messages clients' },
                    { key: 'reviews', label: 'Nouveaux avis', description: 'Notifications des avis et évaluations' },
                    { key: 'promotions', label: 'Promotions', description: 'Offres spéciales et actualités ArtisanHub' },
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{notification.label}</h4>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.notifications.email[notification.key as keyof typeof settings.notifications.email]}
                          onChange={(e) => handleNotificationChange('email', notification.key, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications push</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'newOrders', label: 'Nouvelles commandes', description: 'Notifications instantanées sur vos appareils' },
                    { key: 'messages', label: 'Nouveaux messages', description: 'Alertes pour les messages clients' },
                    { key: 'reviews', label: 'Nouveaux avis', description: 'Notifications des avis clients' },
                    { key: 'promotions', label: 'Promotions', description: 'Offres et actualités' },
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{notification.label}</h4>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.notifications.push[notification.key as keyof typeof settings.notifications.push]}
                          onChange={(e) => handleNotificationChange('push', notification.key, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email
                    </label>
                    <Input
                      type="email"
                      value={settings.account.email}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        account: { ...prev.account, email: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Laissez vide pour ne pas changer"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentification à deux facteurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">2FA</h4>
                      <p className="text-sm text-gray-600">
                        Renforcez la sécurité de votre compte
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {settings.account.twoFactorEnabled ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Activé
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Désactivé
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          account: { ...prev.account, twoFactorEnabled: !prev.account.twoFactorEnabled }
                        }))}
                      >
                        {settings.account.twoFactorEnabled ? 'Désactiver' : 'Activer'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'shop' && (
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de la boutique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Acceptation automatique des commandes</h4>
                    <p className="text-sm text-gray-600">
                      Les commandes sont automatiquement acceptées sans validation manuelle
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.shop.autoAcceptOrders}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        shop: { ...prev.shop, autoAcceptOrders: e.target.checked }
                      }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Mode vacances</h4>
                    <p className="text-sm text-gray-600">
                      Suspendre temporairement les ventes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.shop.vacationMode}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        shop: { ...prev.shop, vacationMode: e.target.checked }
                      }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Délai de traitement par défaut
                  </label>
                  <Input
                    value={settings.shop.processingTime}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      shop: { ...prev.shop, processingTime: e.target.value }
                    }))}
                    placeholder="Ex: 2-3 jours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant minimum de commande (€)
                  </label>
                  <Input
                    type="number"
                    value={settings.shop.minimumOrderAmount}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      shop: { ...prev.shop, minimumOrderAmount: Number(e.target.value) }
                    }))}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de paiement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compte bancaire
                    </label>
                    <div className="flex items-center space-x-3">
                      <Input value={settings.payment.bankAccount} disabled />
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de TVA
                    </label>
                    <Input
                      value={settings.payment.taxNumber}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        payment: { ...prev.payment, taxNumber: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                      <div>
                        <h4 className="font-medium text-orange-900">Commission ArtisanHub</h4>
                        <p className="text-sm text-orange-800">
                          Notre commission est de {settings.payment.commission}% sur chaque vente
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'shipping' && (
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seuil de livraison gratuite (€)
                  </label>
                  <Input
                    type="number"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      shipping: { ...prev.shipping, freeShippingThreshold: Number(e.target.value) }
                    }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Livraison gratuite pour les commandes supérieures à ce montant
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coût livraison standard (€)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.shipping.standardShippingCost}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      shipping: { ...prev.shipping, standardShippingCost: Number(e.target.value) }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coût livraison express (€)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.shipping.expressShippingCost}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      shipping: { ...prev.shipping, expressShippingCost: Number(e.target.value) }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Sessions actives</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Gérez les appareils connectés à votre compte
                    </p>
                    <Button variant="outline" size="sm">
                      Voir les sessions
                    </Button>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">Zone de danger</h4>
                    <p className="text-sm text-red-800 mb-3">
                      Actions irréversibles pour votre compte
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-100">
                        Supprimer mon compte
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-100">
                        Désactiver ma boutique
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VendorSettingsPage;