'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/store/useUIStore';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  vendorInfo?: {
    isApproved?: boolean;
    businessName?: string;
  };
  profile?: {
    phone?: string;
  };
}

interface UserStats {
  totalUsers: number;
  totalBuyers: number;
  totalVendors: number;
  totalAdmins: number;
  verifiedUsers: number;
  pendingVendors: number;
}

interface UsersData {
  users: User[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: UserStats;
}

const AdminUsersPage: React.FC = () => {
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadUsers();
  }, [searchQuery, roleFilter, statusFilter, currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }

      const usersData = await response.json();
      setData(usersData);
    } catch (error: any) {
      console.error('Users loading error:', error);
      setError(error.message);
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger les utilisateurs',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      const result = await response.json();
      
      addNotification({
        type: 'success',
        title: 'Utilisateur supprimé',
        message: result.message,
      });

      // Recharger la liste
      loadUsers();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Impossible de supprimer l\'utilisateur',
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVerified: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      addNotification({
        type: 'success',
        title: 'Statut mis à jour',
        message: `Utilisateur ${!currentStatus ? 'vérifié' : 'non vérifié'}`,
      });

      loadUsers();
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Impossible de mettre à jour le statut',
      });
    }
  };

  const getStatusColor = (user: User) => {
    if (user.role === 'vendor') {
      if (user.vendorInfo?.isApproved) return 'bg-green-100 text-green-800';
      return 'bg-yellow-100 text-yellow-800';
    }
    return user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (user: User) => {
    if (user.role === 'vendor') {
      return user.vendorInfo?.isApproved ? 'Approuvé' : 'En attente';
    }
    return user.isVerified ? 'Vérifié' : 'Non vérifié';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'vendor': return 'bg-blue-100 text-blue-800';
      case 'buyer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'vendor': return 'Vendeur';
      case 'buyer': return 'Acheteur';
      default: return role;
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (type: 'role' | 'status', value: string) => {
    if (type === 'role') {
      setRoleFilter(value);
    } else {
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur de chargement</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={loadUsers}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez tous les utilisateurs de la plateforme
            </p>
          </div>
          <div className="text-gray-800 mt-4 sm:mt-0 flex space-x-3">
            <Button onClick={loadUsers} variant="outline">
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {data?.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total utilisateurs', value: data.stats.totalUsers, color: 'text-blue-600' },
            { label: 'Acheteurs', value: data.stats.totalBuyers, color: 'text-purple-600' },
            { label: 'Vendeurs', value: data.stats.totalVendors, color: 'text-green-600' },
            { label: 'En attente', value: data.stats.pendingVendors, color: 'text-yellow-600' },
          ].map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtre par rôle */}
            <div className="sm:w-48">
              <select
                value={roleFilter}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="vendor">Vendeurs</option>
                <option value="buyer">Acheteurs</option>
              </select>
            </div>

            {/* Filtre par statut */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="verified">Vérifiés</option>
                <option value="unverified">Non vérifiés</option>
                <option value="pending">En attente (vendeurs)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>
            Utilisateurs ({data?.pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.users || data.users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun utilisateur trouvé
              </h3>
              <p className="text-gray-600">
                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Modifiez vos critères de recherche'
                  : 'Aucun utilisateur dans la base de données'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>

                  {/* Informations utilisateur */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleText(user.role)}
                      </Badge>
                      <Badge className={getStatusColor(user)}>
                        {getStatusText(user)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      {user.vendorInfo?.businessName && (
                        <span className="text-blue-600">{user.vendorInfo.businessName}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleUserStatus(user._id, user.isVerified)}
                      title={user.isVerified ? 'Révoquer la vérification' : 'Vérifier l\'utilisateur'}
                    >
                      {user.isVerified ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {user.role !== 'admin' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(data.pagination.current - 1)}
                  disabled={!data.pagination.hasPrev || loading}
                >
                  Précédent
                </Button>
                
                {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      // variant={page === data.pagination.current ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(data.pagination.current + 1)}
                  disabled={!data.pagination.hasNext || loading}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;