export type GetAllProductsQueryParams = {
    page: number,
    limit: number,
    search: string,
    location?: string
}

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