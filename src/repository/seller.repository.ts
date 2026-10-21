import { prisma } from "../database/prisma.js";
import type { SellerShippingSettings, StorePolicies } from "../types/store.js";

export class SellerRepository {
        async getShippingSetting(storeId: string,sellerId: string,): Promise<SellerShippingSettings | null> {
      return prisma.sellerShippingSettings.findFirst({
        where: {
          storeId,
          store: {
            userId: sellerId,
          },
        },
      });
    }

    async updateShippingSetting(storeId: string,sellerId: string,data: SellerShippingSettings): Promise<SellerShippingSettings> {
      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          userId: sellerId,
        },
        select: {
          id: true,
        },
      });

      if (!store) {
        throw new Error("Store not found or access denied");
      }

      return prisma.sellerShippingSettings.upsert({
        where: {
          storeId,
        },
        create: {
          storeId,
          zone1: data.zone1 ?? 0,
          zone2: data.zone2 ?? 0,
          zone3: data.zone3 ?? 0,
          freeShippingThreshold: data.freeShippingThreshold ?? null,
          processingHours: data.processingHours ?? 0,
          returnWindowDays: data.returnWindowDays ?? 0,
          returnShippingPayer:
            data.returnShippingPayer ?? "seller_if_defective",
        },
        update: data,
      });
    }

    async getStorePolicies(storeId: string, sellerId: string): Promise<StorePolicies | null> {
      return prisma.storePolicy.findFirst({
        where: {
          storeId,
          store: {
            userId: sellerId,
          },
        },
      });
    }

    async updateStorePolicies(storeId: string, sellerId: string, data: Partial<StorePolicies>): Promise<StorePolicies | null> {
      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          userId: sellerId,
        },
        select: {
          id: true,
        },
      });
      if (!store) return null
      return prisma.storePolicy.upsert({
        where: { storeId },
        create: {
            storeId,
            returnPolicy: data.returnPolicy ?? "",
            refundPolicy: data.refundPolicy ?? "",
            cancellationPolicy: data.cancellationPolicy ?? "",
            privacyPolicy: data.privacyPolicy ?? "",
        },
        update: {
            ...(data.returnPolicy !== undefined && { returnPolicy: data.returnPolicy }),
            ...(data.refundPolicy !== undefined && { refundPolicy: data.refundPolicy }),
            ...(data.cancellationPolicy !== undefined && {
            cancellationPolicy: data.cancellationPolicy,
            }),
            ...(data.privacyPolicy !== undefined && { privacyPolicy: data.privacyPolicy }),
        }
      })
    }
}