import * as storeService from "../services/store.service.js";

/**
 * @swagger
 * /api/v1/stores:
 *   post:
 *     summary: 가게 추가
 *     description: 새로운 가게를 등록합니다. 가게명, 주소, 지역 ID(선택), 점수(선택)를 포함해야 합니다.
 *     tags:
 *       - Stores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "홍길동 카페"
 *                 description: 가게명 (필수)
 *               address:
 *                 type: string
 *                 example: "서울시 강남구 강남대로 123"
 *                 description: 가게 주소 (필수)
 *               region_id:
 *                 type: integer
 *                 example: 1
 *                 description: 지역 ID (선택)
 *               score:
 *                 type: number
 *                 format: float
 *                 example: 4.5
 *                 description: 가게 평점 (선택, 0~5 사이의 값)
 *     responses:
 *       201:
 *         description: 가게 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "가게가 성공적으로 추가되었습니다."
 *                 store_id:
 *                   type: integer
 *                   example: 5
 *                   description: 생성된 가게 ID
 *       400:
 *         description: 가게 추가 실패 - 필수 필드 누락 또는 유효하지 않은 입력값
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 필드가 누락되었습니다."
 */
export const addStore = async (req, res) => {
  try {
    const storeId = await storeService.createStore(req.body);
    res.status(201).json({
      message: "가게가 성공적으로 추가되었습니다.",
      store_id: storeId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listStoreReviews = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await storeService.listStoreReviews(storeId, cursor);

    res.status(200).json(reviews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/stores/{storeId}/reviews:
 *   get:
 *     summary: 가게 리뷰 조회
 *     description: 특정 가게의 리뷰 목록을 조회합니다. 커서 기반 페이지네이션을 지원합니다.
 *     tags:
 *       - Stores
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: 조회할 가게 ID
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         example: 0
 *         description: 조회 시작 위치 (기본값 0, 페이지네이션용 커서)
 *     responses:
 *       200:
 *         description: 리뷰 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           content:
 *                             type: string
 *                             example: "정말 맛있는 커피를 제공합니다!"
 *                           rating:
 *                             type: number
 *                             format: float
 *                             example: 4.5
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-15T10:30:00Z"
 *                           name:
 *                             type: string
 *                             example: "홍길동"
 *                       description: 리뷰 배열
 *                     cursor:
 *                       type: integer
 *                       example: 5
 *                       description: 다음 페이지를 위한 커서 값 (마지막 리뷰 ID)
 *       400:
 *         description: 리뷰 조회 실패 - 유효하지 않은 가게 ID 또는 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "가게를 찾을 수 없습니다."
 */
export const getStoreReviewsController = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { cursor } = req.query;

    const data = await storeService.getStoreReviews(storeId, cursor ? Number(cursor) : 0);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
