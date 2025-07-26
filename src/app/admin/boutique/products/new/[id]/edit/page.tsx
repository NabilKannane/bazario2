// src/app/admin/boutique/products/[id]/edit/page.tsx
'use client';

import React from 'react';
import AdminBazarioProductForm from '@/components/admin/AdminBazarioProductForm';

interface EditBazarioProductPageProps {
  params: { id: string };
}

const EditBazarioProductPage: React.FC<EditBazarioProductPageProps> = ({ params }) => {
  return <AdminBazarioProductForm productId={params.id} />;
};

export default EditBazarioProductPage;