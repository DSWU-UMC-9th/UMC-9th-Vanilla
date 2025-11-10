// src/dtos/mission.dto.js
export const toMissionEntity = (body) => {
  return {
    store_id: body.store_id ? BigInt(body.store_id) : undefined,
    reward: body.reward !== undefined ? Number(body.reward) : null,
    deadline: body.deadline ? new Date(body.deadline) : null,
    mission_spec: body.mission_spec,
  };
};

export const responseFromMission = (mission) => {
  if (!mission) return null;
  return {
    id: mission.id,
    store_id: mission.store_id,
    reward: mission.reward,
    deadline: mission.deadline,
    mission_spec: mission.mission_spec,
    created_at: mission.created_at,
    updated_at: mission.updated_at,
  };
};
