import type { BusinessHours } from "@Fiandriananaprime/nova_api_type";
import { prisma } from "../database/prisma.js";
import type { Store, StoreSettings, StoreSummary } from "../types/store.js";
import { isStoreOpen } from "../utils/BusinessHours.js";
import type { role } from "../types/userRole.js";

export class StoreRepository {

    async getFollowedStores(userId: string): Promise<Store[]> {
      const followedStores = await prisma.storeFollower.findMany({
        where: { userId },
        include: { store: true },
        orderBy: { createdAt: "desc" },
      });

      return followedStores.map(({ store }) => ({
        id: store.id,
        userId: store.userId,
        name: store.name,
        slug: store.slug,
        logoUrl: store.logoUrl,
        coverUrl: store.coverUrl,
        verified: store.verified,
        rating: Number(store.rating),
        reviewsCount: store.reviewsCount,
        productsCount: store.productsCount,
        location: store.location,
        joinedYear: String(store.createdAt.getFullYear()),
        followersCount: store.followersCount,
        description: store.description,
        isOpen: isStoreOpen(
          store.businessHours as BusinessHours,
          store.vacationMode,
        ),
        isFollowedByCurrentUser: true,
        contact: {
          phone: store.phone,
          email: store.email,
          website: store.website,
        },
      }));
    }

    async findStores(search: string, page: number, limit: number, location?: string) {
        const [stores, total] = await Promise.all([
          prisma.store.findMany({
            where: {
              ...(search && { name: { contains: search, mode: "insensitive" } }),
              ...(location && { location: { contains: location, mode: "insensitive" } }),
            },
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              verified: true,
              rating: true,
              reviewsCount: true,
              productsCount: true,
            },
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.store.count({
            where: {
              ...(search && { name: { contains: search, mode: "insensitive" } }),
              ...(location && { location: { contains: location, mode: "insensitive" } }),
            },
          }),
        ]);

         const data: StoreSummary[] = stores.map(store => ({
            ...store,
            rating: Number(store.rating),
        }));

        return {
          data,
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
    }

    async getStoreById(
  id: string,
  userId: string | null,
  role: role
): Promise<Store | StoreSettings | null> {

  if (role === 'SELLER') {
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        policy: true,
      },
    });

    if (!store) return null;

    return {
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description ?? "",
      logoUrl: store.logoUrl,
      coverUrl: store.coverUrl,
      location: store.location,
      phone: store.phone,
      email: store.email,
      vacationMode: store.vacationMode,
      businessHours: store.businessHours as BusinessHours,
      socialLinks: store.socialLinks,
      policies: {
        returnPolicy: store.policy?.returnPolicy ?? '',
        refundPolicy: store.policy?.refundPolicy ?? '',
        cancellationPolicy: store.policy?.cancellationPolicy ?? '',
        privacyPolicy: store.policy?.privacyPolicy ?? '',
      },
    };
  }

  const store = await prisma.store.findUnique({
    where: { id },
  });

  if (!store) return null;

  const isOpen = isStoreOpen(
    store.businessHours as BusinessHours,
    store.vacationMode
  );

  let isFollowedByCurrentUser: boolean | null = null;

  if (userId) {
    const follow = await prisma.storeFollower.findUnique({
      where: {
        storeId_userId: {
          storeId: id,
          userId,
        },
      },
    });

    isFollowedByCurrentUser = !!follow;
  }

  return {
    id: store.id,
    userId: store.userId,
    name: store.name,
    slug: store.slug,
    logoUrl: store.logoUrl,
    coverUrl: store.coverUrl,
    verified: store.verified,
    rating: Number(store.rating),
    reviewsCount: store.reviewsCount,
    productsCount: store.productsCount,
    location: store.location,
    joinedYear: String(store.createdAt.getFullYear()),
    followersCount: store.followersCount,
    description: store.description ?? "",
    isOpen,
    isFollowedByCurrentUser,
    contact: {
      phone: store.phone,
      email: store.email,
      website: store.website,
    },
  };
}
    async getFeaturedStore() {
      const now = new Date();

      const data = await prisma.featuredStore.findMany({
          where: {
              startsAt: { lte: now },
              OR: [
                  { endsAt: null },
                  { endsAt: { gt: now } },
              ],
          },
          orderBy: { position: "asc" },
          take: 5,
          include: { store: true },
      });
      const featured: StoreSummary[] = data.map(({ store }) => ({
            id: store.id,
            name: store.name,
            slug: store.slug,
            logoUrl: store.logoUrl,
            verified: store.verified,
            rating: store.rating.toNumber(),
            reviewsCount: store.reviewsCount,
            productsCount: store.productsCount,
        }));

        return {
          data: featured,
        };
    }

    async followStore(storeId: string, userId: string) {
      await prisma.storeFollower.create({
        data: {
          storeId,
          userId,
        },
      });

      await prisma.store.update({
        where: { id: storeId },
        data: {
          followersCount: { increment: 1 },
        },
      });
    }

    async unfollowStore(storeId: string, userId: string) {
      await prisma.storeFollower.delete({
        where: {
          storeId_userId: {
            storeId,
            userId,
          },
        },
      });

      await prisma.store.update({
        where: { id: storeId },
        data: {
          followersCount: { decrement: 1 },
        },
      });
    }

    async getStoreBySellerId(sellerId: string): Promise<StoreSummary[]> {
      const stores = await prisma.store.findMany({ where: { userId: sellerId }});
      return stores.map(store => ({
        id: store.id,
        name: store.name,
        slug: store.slug,
        logoUrl: store.logoUrl,
        coverUrl: store.coverUrl,
        verified: store.verified,
        rating: Number(store.rating),
        reviewsCount: store.reviewsCount,
        productsCount: store.productsCount,
      }));
    }
  }