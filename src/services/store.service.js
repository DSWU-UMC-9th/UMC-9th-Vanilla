// src/services/store.service.js
import * as storeRepository from "../repositories/store.repository.js";

export const createStore = async (data) => {
  if (!data.region_id || !data.name || !data.address || data.score === undefined) {
    throw new Error("필수 필드 누락");
  }

  // 여기서 region_id가 숫자/문자열로 들어오면 BigInt 변환은 repository에서 해도 되고
  const payload = {
    region_id: BigInt(data.region_id),
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
