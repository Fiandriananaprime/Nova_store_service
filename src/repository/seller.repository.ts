import { prisma } from "../database/prisma.js";
import type { SellerShippingSettings } from "../types/store.js";

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
}