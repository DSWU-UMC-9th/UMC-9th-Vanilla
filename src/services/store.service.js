import * as storeRepository from "../repositories/store.repository.js";
import { responseFromReviews } from "../dtos/store.dto.js";

export const createStore = async (data) => {
  if (!data.region_id || !data.name || !data.address || data.score === undefined) {
    throw new Error("필수 필드 누락");
  }

  const payload = {
    region_id: Number(data.region_id),
    name: data.name,
    address: data.address,
    score: Number(data.score),
  };

  const result = await storeRepository.addStore(payload);

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.storeId;
};

export const listStoreReviews = async (storeId, cursor) => {
  const reviews = await storeRepository.getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

export const getStoreReviews = async (storeId, cursor = 0) => {
  const reviews = await storeRepository.getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};
