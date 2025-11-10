// src/dtos/review.dto.js
export const toReviewEntity = (body) => {
  return {
    member_id: body.member_id ? BigInt(body.member_id) : undefined,
    store_id: body.store_id ? BigInt(body.store_id) : undefined,
    body: body.body,
    score: body.score !== undefined ? Number(body.score) : null,
  };
};

export const responseFromReview = (review) => {
  if (!review) return null;
  return {
    id: review.id,
    member_id: review.member_id,
    store_id: review.store_id,
    body: review.body,
    score: review.score,
    created_at: review.created_at,
    updated_at: review.updated_at,
  };
};
