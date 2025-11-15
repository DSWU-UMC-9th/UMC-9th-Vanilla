import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

import { handleUserSignUp } from "./controllers/user.controller.js";
import { addStore, getStoreReviewsController } from "./controllers/store.controller.js";
import { addReview } from "./controllers/review.controller.js";
import { addMission } from "./controllers/mission.controller.js";
import { handleChallengeMission } from "./controllers/user.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/stores", addStore);
app.post("/api/v1/reviews", addReview);
app.post("/api/v1/missions", addMission);
app.post("/api/v1/users/member-mission", handleChallengeMission);
app.get("/api/v1/stores/:storeId/reviews", getStoreReviewsController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
