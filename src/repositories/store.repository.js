import { prisma } from "../db.config.js";

/**
 * data: { region_id, name, address, score }
 */
export const addStore = async (data) => {
  const region = await prisma.region.findUnique({
    where: { id: data.region_id },
  });

  if (!region) {
    return { success: false, message: "존재하지 않는 지역입니다." };
  }

  const created = await prisma.store.create({
    data: {
      region_id: data.region_id,
      name: data.name,
      address: data.address,
      score: data.score,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return { success: true, storeId: created.id };
};

export const getStoreById = async (storeId) => {
  const store = await prisma.store.findUnique({
    where: { id: Number(storeId) },
    include: {
      region: true,
      mission: true,
      review: true,
    },
  });
  return store;
};

export const getAllStoreReviews = async (storeId, cursor = 0) => {
  const reviews = await prisma.review.findMany({
    where: {
      store_id: Number(storeId),
      id: { gt: cursor },
    },
    select: {
      id: true,
      body: true,
      score: true,
      created_at: true,
      member: {
        select: {
          name: true,
          id: true,
        },
      },
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};
