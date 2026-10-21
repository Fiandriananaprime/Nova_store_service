import type { Prisma } from "../generated/prisma/index.js";

export type GetAllProductsQueryParams = {
    page: number,
    limit: number,
    search: string,
    location?: string
}

export type BusinessDay = {
  open?: string;
  close?: string;
  closed?: boolean;
};

export type BusinessHours = {
  monday?: BusinessDay;
  tuesday?: BusinessDay;
  wednesday?: BusinessDay;
  thursday?: BusinessDay;
  friday?: BusinessDay;
  saturday?: BusinessDay;
  sunday?: BusinessDay;
};

export interface StoreSummary  {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  productsCount: number;
};

export interface Store extends StoreSummary {
  userId: string;
  coverUrl: string | null;
  location: string | null;
  joinedYear: string;
  followersCount: number;
  description: string | null;
  isOpen: boolean;
  isFollowedByCurrentUser: boolean | null;
  contact: {
    phone: string | null;
    email: string | null;
    website: string | null;
  };
};

export interface StoreSettings {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  location: string;
  phone: string;
  email: string;
  businessType?: 'individual' | 'company' ;
  taxId?: string ;
  registrationNumber?: string;
  vacationMode: boolean;
  businessHours: BusinessHours;
  socialLinks: Prisma.JsonValue;
  policies: StorePolicies | null;
}

export interface StorePolicies {
  returnPolicy: string;
  refundPolicy: string;
  cancellationPolicy: string;
  privacyPolicy: string;
}

export interface StoreSettingUpdate {
  name?: string;
  slug?: string;
  description?: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  location?: string;
  phone?: string;
  email?: string;
  vacationMode?: boolean;
  businessHours?: BusinessHours;
  socialLinks?: Prisma.JsonValue;
}