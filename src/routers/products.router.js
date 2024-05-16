import express from "express";
import Product from "../schemas/product.schema.js";
import mongoose from "mongoose";
const router = express.Router();

// 목록조회
router.get("/product", async (req, res) => {
  const product = await Product.find().select("-password").sort({ createdAt: -1 }).exec();
  return res.status(200).json({ product });
});

// 데이터 삭제하기
router.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({ errorMessage: "잘못된 상품 ID 형식입니다." });
    }
    const goodsItem = await Product.findById(id).exec();
    if (!goodsItem) {
      return res.status(404).json({ errorMessage: "존재하지 않는 product 데이터입니다." });
    }
    if (password !== goodsItem.password) {
      return res.status(404).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }
    // 조회된 ''을 삭제합니다.
    const data = await Product.findByIdAndDelete({ _id: id }).select("-password").exec();
    return res.status(200).json({ message: "상품 삭제에 성공했습니다.", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMessage: "서버 에러가 발생했습니다." });
  }
});

// 상세조회
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({ errorMessage: "잘못된 상품 ID 형식입니다." });
    }
    const goodsItem = await Product.findById(id).select("-password").exec();
    if (!goodsItem) {
      return res.status(404).json({ errorMessage: "존재하지 않는 상품입니다." });
    }
    return res.status(200).json({ message: "상품 상세 조회에 성공했습니다.", data: goodsItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMessage: "서버 에러가 발생했습니다." });
  }
});

// 데이터 수정하기
router.patch("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const currentProduct = await Product.findById(id).exec();
    console.log(currentProduct);
    if (!currentProduct) {
      return res.status(404).json({ errorMessage: "존재하지 않는 product 데이터입니다." });
    }
    if (updateData.password !== currentProduct.password) {
      return res.status(404).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }
    const data = await Product.findByIdAndUpdate(id, updateData, { new: true }).select("-password").exec();
    return res.status(200).json({ message: "상품 수정에 성공했습니다.", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMessage: "서버 에러가 발생했습니다." });
  }
});

// 데이터 생성하기
router.post("/product", async (req, res) => {
  const { name, description, manager, password } = req.body;
  try {
    const productName = await Product.findOne({ name: name });
    if (productName) {
      return res.status(400).json({ errorMessage: "이미 존재하는 상품입니다." });
    }
    const product = await Product.create({
      name,
      description,
      manager,
      password
    });
    const data = await Product.find(product._id).select("-password").exec();
    // find로 _id를 조회해서 password를 제외하고 값을 가져옴.
    return res.status(200).json({ message: "상품생성에 성공했습니다", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMessage: "서버 에러가 발생했습니다." });
  }
});

export default router;
