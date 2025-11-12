import { prisma } from "../db.config.js";

export const addUser = async (data) => {
  // 이메일 중복 확인
  const exist = await prisma.member.findFirst({
    where: { email: data.email },
  });

  if (exist) return null;

  // 새 멤버 추가
  const newUser = await prisma.member.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      address: data.address,
      spec_address: data.detailAddress,
      status: "ACTIVE",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return newUser.id;
};

export const getUser = async (userId) => {
  const user = await prisma.member.findUnique({
    where: { id: userId },
  });

  return user ? [user] : [];
};

export const setPreference = async (userId, foodCategoryId) => {
  await prisma.member_prefer.create({
    data: {
      member_id: userId,
      category_id: foodCategoryId,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
};

export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.member_prefer.findMany({
    where: { member_id: userId },
    include: {
      food_category: {
        select: { name: true },
      },
    },
    orderBy: {
      category_id: "asc",
    },
  });

  return preferences.map((p) => ({
    id: p.id,
    food_category_id: p.category_id,
    user_id: p.member_id,
    name: p.food_category?.name || null,
  }));
};

export const addMissionToUser = async (userId, missionId) => {
  // 이미 존재하는지 확인
  const exist = await prisma.member_mission.findFirst({
    where: {
      member_id: userId,
      mission_id: missionId,
    },
  });

  if (exist) {
    return { success: false, message: "이미 도전 중인 미션입니다." };
  }

  const newMission = await prisma.member_mission.create({
    data: {
      member_id: userId,
      mission_id: missionId,
      status: "IN_PROGRESS",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return { success: true, memberMissionId: newMission.id };
};
