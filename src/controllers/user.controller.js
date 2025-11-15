import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { challengeMission } from "../services/user.service.js";

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: 사용자 회원가입
 *     description: 새로운 사용자를 등록합니다. 필수 정보(이메일, 이름, 성별, 생년월일, 전화번호, 선호도)를 포함해야 합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - gender
 *               - birth
 *               - phoneNumber
 *               - preferences
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *                 description: 사용자 이메일 (필수)
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *                 description: 사용자 이름 (필수)
 *               gender:
 *                 type: string
 *                 enum: ["M", "F"]
 *                 example: "M"
 *                 description: 성별 (필수)
 *               birth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-15"
 *                 description: 생년월일 (필수, YYYY-MM-DD 형식)
 *               phoneNumber:
 *                 type: string
 *                 example: "010-1234-5678"
 *                 description: 전화번호 (필수)
 *               address:
 *                 type: string
 *                 example: "서울시 강남구"
 *                 description: 주소 (선택)
 *               detailAddress:
 *                 type: string
 *                 example: "강남빌딩 101호"
 *                 description: 상세주소 (선택)
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["카페", "한식"]
 *                 description: 사용자 선호도 카테고리 (필수)
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     name:
 *                       type: string
 *                       example: "홍길동"
 *                     gender:
 *                       type: string
 *                       example: "M"
 *                     birth:
 *                       type: string
 *                       format: date
 *                       example: "1990-01-15"
 *                     address:
 *                       type: string
 *                       example: "서울시 강남구"
 *                     detailAddress:
 *                       type: string
 *                       example: "강남빌딩 101호"
 *                     phoneNumber:
 *                       type: string
 *                       example: "010-1234-5678"
 *                     preferences:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["카페", "한식"]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00Z"
 *       400:
 *         description: 회원가입 실패 - 이미 존재하는 이메일이거나 유효하지 않은 입력값
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "이미 존재하는 이메일입니다."
 */
export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });
};

/**
 * @swagger
 * /api/v1/users/member-mission:
 *   post:
 *     summary: 사용자 미션 도전
 *     description: 사용자가 특정 미션에 도전합니다. 사용자 ID와 미션 ID가 필요합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - missionId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *                 description: 도전할 사용자 ID (필수)
 *               missionId:
 *                 type: integer
 *                 example: 5
 *                 description: 도전할 미션 ID (필수)
 *     responses:
 *       201:
 *         description: 미션 도전 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "미션 도전 시작!"
 *                 member_mission_id:
 *                   type: integer
 *                   example: 10
 *                   description: 생성된 회원 미션 ID
 *       400:
 *         description: 미션 도전 실패 - 필수 필드 누락 또는 유효하지 않은 사용자/미션 ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 필드 누락"
 */
export const handleChallengeMission = async (req, res) => {
  try {
    const { userId, missionId } = req.body;
    const memberMissionId = await challengeMission(userId, missionId);
    res.status(201).json({
      message: "미션 도전 시작!",
      member_mission_id: memberMissionId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
