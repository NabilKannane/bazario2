import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      isVerified: boolean;
      avatar?: string;
      firstName?: string;
      lastName?: string;
      vendorInfo?: {
        isApproved?: boolean;
        businessName?: string;
        specialties?: string[];
        rating?: number;
        totalSales?: number;
      };
      profile?: {
        phone?: string;
        bio?: string;
        address?: any;
        socialLinks?: any;
      };
    };
  }

  interface User {
    role: string;
    isVerified: boolean;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    vendorInfo?: any;
    profile?: any;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    isVerified: boolean;
    firstName?: string;
    lastName?: string;
    vendorInfo?: any;
    profile?: any;
  }
}