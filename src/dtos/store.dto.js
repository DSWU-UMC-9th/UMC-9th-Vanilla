// src/dtos/store.dto.js
export const toStoreEntity = (body) => {
  return {
    region_id: body.region_id ? BigInt(body.region_id) : undefined,
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
