// src/services/review.service.js
import * as reviewRepository from "../repositories/review.repository.js";

export const createReview = async (data) => {
  if (!data.member_id || !data.store_id || !data.body || data.score === undefined) {
    throw new Error("필수 필드 누락");
  }

  const payload = {
    member_id: BigInt(data.member_id),
    store_id: BigInt(data.store_id),
    body: data.body,
    score: Number(data.score),
  };

  const result = await reviewRepository.addReview(payload);

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.reviewId;
};
