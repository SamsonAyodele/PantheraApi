const express = require("express");
const sequelize = require("./connection")
const Product = require("./models/product.model")
const api = express();
const { productSchema, productUpdateSchema } = require("./validators/product.validators")


// a middleware function that is used to parse JSON data sent in the request body. It allows your Express application to handle JSON-encoded data.
api.use(express.json());
api.use(express.urlencoded( {extended: true})); 



// let products = [];

api.get("/", (req, res) => {
  return res.status(200).json({
    message: "Panthera store api service",
  });
});

api.post("/product", async (req, res) => {
  const productCheck = productSchema.validate(req.body);
  if(productCheck.error) {
    return res.status(400).json({
      message: productCheck.error.message
    })
  }

  // check if product already exist
  // let productExist = products.find((prod) => prod.name.toLowerCase() === req.body.name.toLowerCase()
  // );

  let productExist = await Product.findOne({
    where: {
      name: req.body.name
    }
  })

  if (productExist) return res.status(400).json({
    message: `product ${req.body.name} already exist`
  });
 
  const newProduct = await Product.create(req.body)
  return res.status(201).json({
    message: "product created successfully",
    products: newProduct
  });
  // const newProduct = { id: products.length + 1, ...req.body };
  // products.push(newProduct);
  // return res.status(201).json({
  //   message: "product created successfully",
  //   products: products
  // });
});

api.get("/product", async (req, res) => {
  // console.log(req.params);
  const products = await Product.findAll({})
  return res.status(200).json({
    message: "product retrieved successfully",
    products: products,
  });
});


// GET PRODUCT BY ID
api.get("/product/:productId",  async (req, res) => {
  // console.log(req.params);
  const productId = req.params.productId
  // const product = products.find((prod) => prod.id == productId);
  const product = await Product.findByPk(productId);
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
api.put("/product/:productId", async (req, res) => {
  const productCheck = productUpdateSchema.validate(req.body);
  if(productCheck.error) {
    return res.status(400).json({
      message: productCheck.error.message
    })
  }
  const productId = req.params.productId
  const product = await products.update(req.body, {
    where: {
      id: productId,
    }
  })
  // Check if the product exist
  if (!product){
    return res.status(404).json({
      message: "Product not found"
   });
 } else {
  return res.status(200).json({
    message: "Product updated successfully",
   });
 }
  // if (product !== -1){
  //    // Update the product in the array
  //   products[product]= {...products[product], ...updateProduct}
  //   return res.status(200).json({
  //     message: "Product updated successfully",
  //     updatedProduct: products[product]
  //   });
  // } else {
  //   return res.status(404).json({
  //     message: "Product not found"
  //   });
  // }
})

// DELETE PRODUCT
api.delete("/product/:productId", async (req, res) => {
  const productId = req.params.productId
  // const product = products.findIndex((prod) => prod.id == productId);
    const product = await products.destroy({
      where: {
        id: productId
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    } else {
      return res.status(200).json({
        message: "product deleted successfully",
        product: product
      })
    }

  // if (product !== -1) {
  //   products.splice(product, 1)

  //   return res.status(200).json({
  //     message: "product deleted successfully"
  //   })
  // } else {
  //   return res.status(404).json({
  //     message: "Product not found"
  //   });
  // }
})


api.listen(4000,  async() => {
  console.log("Api listening on port 4000");
  try {
    // sync all models
    await sequelize.sync({alter: true});
    console.log('All models synchronized successfully.')
    await sequelize.authenticate();
    console.log('Connection has been established successfully.')
  }catch(error){
    console.error('Unable to connect to the database:', error.message)
  }
});
