import { prisma } from "../db.config.js";

// ✅ 유저 생성 (이메일 중복 확인 포함)
export const addUser = async (data) => {
  // 이메일 중복 확인
  const exist = await prisma.member.findUnique({
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
      // Prisma에서는 created_at / updated_at을 자동 생성 안 하므로 직접 넣어도 돼
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return newUser.id;
};

// ✅ 유저 조회
export const getUser = async (userId) => {
  const user = await prisma.member.findUnique({
    where: { id: BigInt(userId) },
  });

  return user ? [user] : [];
};

// ✅ 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.member_prefer.create({
    data: {
      member_id: BigInt(userId),
      category_id: BigInt(foodCategoryId),
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
};

// ✅ 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.member_prefer.findMany({
    where: { member_id: BigInt(userId) },
    include: {
      food_category: {
        select: { name: true },
      },
    },
    orderBy: {
      category_id: "asc",
    },
  });

  // SQL에서 SELECT alias 맞추던 것처럼 가공
  return preferences.map((p) => ({
    id: p.id,
    food_category_id: p.category_id,
    user_id: p.member_id,
    name: p.food_category?.name || null,
  }));
};

// ✅ 미션 도전 (member_mission)
export const addMissionToUser = async (userId, missionId) => {
  // 이미 존재하는지 확인
  const exist = await prisma.member_mission.findFirst({
    where: {
      member_id: BigInt(userId),
      mission_id: BigInt(missionId),
    },
  });

  if (exist) {
    return { success: false, message: "이미 도전 중인 미션입니다." };
  }

  const newMission = await prisma.member_mission.create({
    data: {
      member_id: BigInt(userId),
      mission_id: BigInt(missionId),
      status: "IN_PROGRESS",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return { success: true, memberMissionId: newMission.id };
};
