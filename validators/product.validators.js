// PRODUCT VALIDATION USING JOI
const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().required().min(10),
});

const productUpdateSchema = Joi.object({
  price: Joi.number(),
  description: Joi.string(),
});

module.exports = {
  productSchema,
  productUpdateSchema
};
