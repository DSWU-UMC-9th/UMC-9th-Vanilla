import * as storeService from "../services/store.service.js";

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
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API';
    #swagger.responses[200] = {
      description: "상점 리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                        user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                        content: { type: "string" }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
  */
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
