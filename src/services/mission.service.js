// src/services/mission.service.js
import * as missionRepository from "../repositories/mission.repository.js";

export const createMission = async (data) => {
  if (!data.store_id || data.reward === undefined || !data.deadline || !data.mission_spec) {
    throw new Error("필수 필드 누락");
  }

  const payload = {
    store_id: BigInt(data.store_id),
    reward: Number(data.reward),
    deadline: new Date(data.deadline),
    mission_spec: data.mission_spec,
  };

  const result = await missionRepository.addMission(payload);

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.missionId;
};
