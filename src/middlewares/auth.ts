import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});


export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  // console.log(authorization)
  if (!authorization || !authorization.startsWith("Bearer")) {
    console.log("error is here")
    return res.sendStatus(401);
  }

  // Bearer kjlahdjkasghdkhjagsdghkjasgdahkjgahs
  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload
    const auth0Id = decoded.sub

    const user = await User.findOne({ auth0Id });
    if (!user) {
      console.log(
        "error while finding user by auth id during authorization in middleware "
      );
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    console.log(error, "Error while authorization",error);
    return res.sendStatus(401);
  }
};
