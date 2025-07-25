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

  account: {
    email: 'marie.dubois@email.com',
    twoFactorEnabled: false,
  },
  shop: {
    autoAcceptOrders: false,
    vacationMode: false,
    minimumOrderAmount: 0,
    processingTime: '2-3 jours',
  }
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
    { id: 'account', name: 'Compte', icon: User },
    { id: 'security', name: 'Sécurité', icon: Shield },
  ];

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
          className="lg:col-span-3">

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


          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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