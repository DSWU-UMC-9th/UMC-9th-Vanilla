import * as reviewService from "../services/review.service.js";

/**
 * @swagger
 * /api/v1/reviews:
 *   post:
 *     summary: 리뷰 추가
 *     description: 가게에 대한 새로운 리뷰를 등록합니다. 사용자 ID, 가게 ID, 리뷰 내용, 평점을 포함해야 합니다.
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - member_id
 *               - store_id
 *               - body
 *               - score
 *             properties:
 *               member_id:
 *                 type: integer
 *                 example: 1
 *                 description: 리뷰를 작성하는 사용자 ID (필수)
 *               store_id:
 *                 type: integer
 *                 example: 5
 *                 description: 리뷰 대상 가게 ID (필수)
 *               body:
 *                 type: string
 *                 example: "정말 맛있는 커피와 친절한 직원이 있는 좋은 카페입니다!"
 *                 description: 리뷰 내용 (필수)
 *               score:
 *                 type: number
 *                 format: float
 *                 example: 4.5
 *                 description: 평점 (필수, 0~5 사이의 값)
 *     responses:
 *       201:
 *         description: 리뷰 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "리뷰 등록 완료"
 *                 review_id:
 *                   type: integer
 *                   example: 15
 *                   description: 생성된 리뷰 ID
 *       400:
 *         description: 리뷰 추가 실패 - 필수 필드 누락 또는 유효하지 않은 입력값 (예: 평점이 0~5 범위 벗어남)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "평점은 0~5 사이의 값이어야 합니다."
 */
export const addReview = async (req, res) => {
  try {
    const reviewId = await reviewService.createReview(req.body);
    res.status(201).json({
      message: "리뷰 등록 완료",
      review_id: reviewId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
