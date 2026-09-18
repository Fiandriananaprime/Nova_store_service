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

export type StoreSummary = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  productsCount: number;
};

export type Store = {
  id: string;
  userId: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  coverUrl: string | null;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  productsCount: number;
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