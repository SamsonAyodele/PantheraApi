const express = require("express");
const api = express();
const Joi = require("joi")


// PRODUCT VALIDATION USING JOI
const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required().min(10),
});

api.use(express.json());
api.use(express.urlencoded( {extended: true}));

let products = [];

api.get("/", (req, res) => {
  return res.status(200).json({
    message: "Panthera store api service",
  });
});

api.post("/product", (req, res) => {
  const productCheck = productSchema.validate(req.body);
  if(productCheck.error) {
    return res.status(400).json({
      message: productCheck.error.message
    })
  }

  // check if product already exist
  let productExist = products.find((prod) => prod.name.toLowerCase() === req.body.name.toLowerCase()
  );
  if (productExist) return res.status(400).json({
    message: `product ${req.body.name} already exist`
  });

  const newProduct = { id: products.length + 1, ...req.body };
  products.push(newProduct);
  return res.status(201).json({
    message: "product created successfully",
    products: products
  });
});

api.get("/product", (req, res) => {
  console.log(req.params);
  return res.status(200).json({
    message: "product retrieved successfully",
    products: products,
  });
});


// GET PRODUCT BY ID
api.get("/product/:productId",  (req, res) => {
  console.log(req.params);
  const productId = req.params.productId
  const product = products.find((prod) => prod.id == productId);
  if (!product) {
    return res.status(404).json({
      message: "product not found, no product exist with that id",
    });
  }
  return res.status(200).json({
    message: "product retrieved",
    product: product,
  });
});


// UPDATE PRODUCT
api.put("/product/:productId", (req, res) => {
  const productId = req.params.productId
  const product = products.findIndex((prod) => prod.id == productId);
  const updateProduct = req.body

  if (product !== -1){
    products[product]= {...products[product], ...updateProduct}
    return res.status(200).json({
      message: "Product updated successfully",
      updatedProduct: products[product]
    });
  } else {
    return res.status(404).json({
      message: "Product not found"
    });
  }
})

// DELETE PRODUCT
api.delete("/product/:productId", (req, res) => {
  const productId = req.params.productId
  const product = products.findIndex((prod) => prod.id == productId);
  if (product !== -1) {
    products.splice(product)

    return res.status(200).json({
      message: "product deleted successfully"
    })
  } else {
    return res.status(404).json({
      message: "Product not found"
    });
  }
})




api.listen(4000,  () => {
  console.log("Service listening on port 4000");
});
