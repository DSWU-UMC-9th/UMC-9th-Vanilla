// src/repositories/mission.repository.js
import { prisma } from "../db.config.js";

/**
 * data: { store_id, reward, deadline, mission_spec }
 */
export const addMission = async (data) => {
  // store 존재 여부 확인
  const store = await prisma.store.findUnique({
    where: { id: data.store_id },
  });

  if (!store) {
    return { success: false, message: "해당 가게가 존재하지 않습니다." };
  }

  const created = await prisma.mission.create({
    data: {
      store_id: data.store_id,
      reward: data.reward,
      deadline: data.deadline,
      mission_spec: data.mission_spec,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return { success: true, missionId: created.id };
};

export const getMissionById = async (missionId) => {
  return prisma.mission.findUnique({
    where: { id: BigInt(missionId) },
    include: { store: true, member_mission: true },
  });
};
