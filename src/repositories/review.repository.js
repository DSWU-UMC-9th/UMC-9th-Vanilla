// src/repositories/review.repository.js
import { prisma } from "../db.config.js";

/**
 * data: { member_id, store_id, body, score }
 */
export const addReview = async (data) => {
  // store 존재 여부 확인
  const store = await prisma.store.findUnique({
    where: { id: data.store_id },
  });

  if (!store) {
    return { success: false, message: "해당 가게가 존재하지 않습니다." };
  }

  // member 존재 여부 확인 (선택)
  const member = await prisma.member.findUnique({
    where: { id: data.member_id },
  });
  if (!member) {
    return { success: false, message: "해당 유저가 존재하지 않습니다." };
  }

  const created = await prisma.review.create({
    data: {
      member_id: data.member_id,
      store_id: data.store_id,
      body: data.body,
      score: data.score,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return { success: true, reviewId: created.id };
};

export const getReviewsByStoreId = async (storeId) => {
  return prisma.review.findMany({
    where: { store_id: BigInt(storeId) },
    include: { review_image: true, member: true },
    orderBy: { created_at: "desc" },
  });
};
