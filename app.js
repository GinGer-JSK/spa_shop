// /app.js

import express from "express";
import cors from "cors";
import router from "./src/routers/products.router.js";
import connect from "./src/schemas/index.js";
import dotenv from "dotenv";
dotenv.config();
connect();

const app = express();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hi!" });
});

// api 주소로 접근하였을 때, router와 TodosRouter로 클라이언트의 요청이 전달됩니다.
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, "포트로 서버가 열렸어요!");
});

// 202405
