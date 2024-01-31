const express = require("express");
const api = express();
const sequelize = require("./connection");
const Product = require("./models/product.model");
const {
  productSchema,
  productUpdateSchema,
} = require("./validators/product.validators");

// a middleware function that is used to parse JSON data sent in the request body.
// It allows your Express application to handle JSON-encoded data.
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

// let products = [];

api.get("/", (req, res) => {
  return res.status(200).json({
    message: "Panthera store api service",
  });
});

api.post("/product", async (req, res) => {
  const productCheck = productSchema.validate(req.body);
  if (productCheck.error) {
    return res.status(400).json({
      message: productCheck.error.message,
    });
  }

  let productExist = await Product.findOne({
    where: {
      name: req.body.name,
    },
  });

  if (productExist)
    return res.status(400).json({
      message: `product ${req.body.name} already exist`,
    });

  const newProduct = await Product.create(req.body);
  return res.status(201).json({
    message: "product created successfully",
    products: newProduct,
  });
});

api.get("/product", async (req, res) => {
  console.log(req.params);
  const product = await Product.findAll({});
  return res.status(200).json({
    message: "product retrieved successfully",
    products: product,
  });
});

// GET PRODUCT BY ID
api.get("/product/:productId", async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({
      message: "product not found, no product exist with that id",
    });
  }
  return res.status(200).json({
    message: "product retrieved",
    products: product,
  });
});

// UPDATE PRODUCT
api.put("/product/:productId", async (req, res) => {
  const productCheck = productUpdateSchema.validate(req.body);
  if (productCheck.error) {
    return res.status(400).json({
      message: productCheck.error.message,
    });
  }
  const productId = req.params.productId;
  const product = await Product.update(req.body, {
    where: {
      id: productId,
    },
  });
  // Check if the product exist
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  } else {
    return res.status(200).json({
      message: "Product updated successfully",
      products: productId,
    });
  }
});

// DELETE PRODUCT
api.delete("/product/:productId", async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.destroy({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  } else {
    return res.status(200).json({
      message: "product deleted successfully",
      products: productId,
    });
  }
});

api.listen(4000, async () => {
  console.log("Api listening on port 4000");
  try {
    // sync all models
    await sequelize.sync({ alter: true });
    console.log("All models synchronized successfully.");
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
});
