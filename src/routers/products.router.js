import express from "express";
import productSchema from "../schemas/product.schema.js";
const router = express.Router();

// 불러오기
router.get("/product", async (req, res) => {
  const product = await productSchema
    .find()
    .select("-passwords")
    .sort("createdAt")
    .exec();
  return res.status(200).json({ product });
});

// 상세정보 조회하기
router.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const goodsItem = await productSchema.findById(id).select("-passwords");
  return res
    .status(200)
    .json({ message: "상품 상세 조회에 성공했습니다.", data: goodsItem });
});

// 데이터 삭제하기
router.delete("/product/:id", async (req, res) => {
  // 삭제할 ''의 ID 값을 가져옵니다.
  const { id } = req.params;

  // 삭제하려는 ''을 가져옵니다.
  const goodsItem = await productSchema.findById(id).exec();

  // 조회된 ''을 삭제합니다.
  const data = await productSchema
    .findByIdAndDelete({ _id: id })
    .select("-passwords")
    .exec();

  return res
    .status(200)
    .json({ message: "상품 삭제에 성공했습니다.", data: data });
});

// 데이터 수정하기
router.patch("/product/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const currentProduct = await productSchema.findById(id).exec();
  const data = await productSchema
    .findByIdAndUpdate(id, updateData, { new: true })
    .select("-passwords")
    .exec();
  await currentProduct.save();
  return res
    .status(200)
    .json({ meaasge: "상품 수정에 성공했습니다.", data: data });
});

// 데이터 생성하기
router.post("/product", async (req, res) => {
  const { name, description, manager, passwords } = req.body;
  const product = await productSchema.create({
    name,
    description,
    manager,
    passwords,
  });
  const data = await productSchema
    .find(product._id)
    .select("-passwords")
    .exec();
  // find로 _id를 조회해서 password를 제외하고 값을 가져옴.
  return res
    .status(200)
    .json({ message: "상품생성에 성공했습니다", data: data });
});

export default router;
