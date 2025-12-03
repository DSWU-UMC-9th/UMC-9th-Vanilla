import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";

import { handleUserSignUp } from "./controllers/user.controller.js";
import { addStore, getStoreReviewsController } from "./controllers/store.controller.js";
import { addReview } from "./controllers/review.controller.js";
import { addMission } from "./controllers/mission.controller.js";
import { handleChallengeMission } from "./controllers/user.controller.js";

dotenv.config();

passport.use("google", googleStrategy);
passport.use("jwt", jwtStrategy); 

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

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

app.get("/oauth2/login/google", 
  passport.authenticate("google", { 
    session: false,
    scope: ["email", "profile"]
  })
);
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
	  session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user; 

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          message: "Google 로그인 성공!",
          tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      }
    });
  }
);

const isLogin = passport.authenticate('jwt', { session: false });

app.get('/mypage', isLogin, (req, res) => {
  res.status(200).json({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
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
