import * as missionService from "../services/mission.service.js";

/**
 * @swagger
 * /api/v1/missions:
 *   post:
 *     summary: 미션 추가
 *     description: 새로운 미션을 등록합니다. 가게 ID, 보상, 마감일, 미션 내용을 포함해야 합니다.
 *     tags:
 *       - Missions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - store_id
 *               - mission_spec
 *             properties:
 *               store_id:
 *                 type: integer
 *                 example: 1
 *                 description: 미션이 등록될 가게 ID (필수)
 *               reward:
 *                 type: integer
 *                 example: 1000
 *                 description: 미션 완료 시 보상 포인트 (선택)
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *                 description: 미션 마감일 (선택, ISO 8601 형식)
 *               mission_spec:
 *                 type: string
 *                 example: "카페에서 아메리카노를 마시고 인증샷 올리기"
 *                 description: 미션 내용/설명 (필수)
 *     responses:
 *       201:
 *         description: 미션 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "미션 등록 완료"
 *                 mission_id:
 *                   type: integer
 *                   example: 10
 *                   description: 생성된 미션 ID
 *       400:
 *         description: 미션 추가 실패 - 필수 필드 누락 또는 유효하지 않은 입력값
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 필드가 누락되었습니다."
 */
export const addMission = async (req, res) => {
  try {
    const missionId = await missionService.createMission(req.body);
    res.status(201).json({
      message: "미션 등록 완료",
      mission_id: missionId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
