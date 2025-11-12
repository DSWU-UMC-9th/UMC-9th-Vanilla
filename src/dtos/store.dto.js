// src/dtos/store.dto.js
export const toStoreEntity = (body) => {
  return {
    region_id: body.region_id ? Number(body.region_id) : undefined,
    name: body.name,
    address: body.address,
    score: body.score !== undefined ? Number(body.score) : null,
  };
};

export const responseFromStore = (store) => {
  if (!store) return null;
  return {
    id: store.id,
    region_id: store.region_id,
    name: store.name,
    address: store.address,
    score: store.score,
    created_at: store.created_at,
    updated_at: store.updated_at,
  };
};

export const responseFromReviews = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      reviews: [],
      cursor: null,
    };
  }

  const formatted = reviews.map((r) => ({
    id: r.id,
    content: r.body,     
    rating: r.score,     
    created_at: r.created_at,
    name: r.member?.name || "익명",
  }));

  const lastCursor = reviews[reviews.length - 1].id;

  return {
    reviews: formatted,
    cursor: lastCursor,
  };
};

