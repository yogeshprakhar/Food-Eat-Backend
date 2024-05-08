import { NextFunction,Request,Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async(req:Request, res:Response, next:NextFunction)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      // console.log("Error occured ",errors)
        return res.status(400).json({errors: errors.array()})
    }
    next()
}

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("name must be string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("AddressLine1 must be string"),
  body("city").isString().notEmpty().withMessage("city must be string"),
  body("country").isString().notEmpty().withMessage("country must be string"),
  handleValidationErrors,
];
