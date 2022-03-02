import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify, decode } from "jsonwebtoken";
import { createLogger } from "../../utils/logger";
import Axios from "axios";
import { Jwt } from "../../auth/Jwt";
import { JwtPayload } from "../../auth/JwtPayload";

const logger = createLogger("auth");

const jwksUrl = "https://dev-3l3kzikq.us.auth0.com/.well-known/jwks.json";

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info("Authorizing a user", event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    logger.error("User not authorized", { error: e.message });

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

// async function verifyToken(authHeader: string): Promise<JwtPayload> {
//   const token = getToken(authHeader);
//   const jwt: Jwt = decode(token, { complete: true }) as Jwt;

//   if (!jwt) console.log("jwt token can not be decoded!");

//   const jwks = await Axios.get(jwksUrl);
//   const signatureVerification = jwks.data.keys.filter((k) => k.kid === jwt.header.kid)?.[0];
//   logger.info("jwt header", { key: jwt.header.kid });
//   logger.info("signatureVerification", { key: signatureVerification });

//   if (!signatureVerification)
//     console.log(`signature verification not found in jwks, expected kid=${jwt.header.kid}`);

//   const { x5c } = signatureVerification;
//   const cert = `-----BEGIN CERTIFICATE-----\n${x5c?.[0]}\n-----END CERTIFICATE-----`;
//   logger.info("cert = ", { key: cert });

//   return verify(token, cert, { algorithms: ["RS256"] }) as JwtPayload;
// }

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;

  if (!jwt) throw new Error("jwt token decoded is not valid");

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  // TODO: Decode the JWT and grab the kid property from the header.
  const jwtKid = jwt.header.kid;
  // TODO: Retrieve the JWKS and filter for potential signature verification keys
  const jwks = await Axios.get(jwksUrl);
  // TODO: Find the signature verification key in the filtered JWKS with a matching kid property
  const signatureVerificationKey = jwks.data.keys.filter((key) => key.kid === jwtKid)[0];
  if (!signatureVerificationKey)
    throw new Error(`Signature verification key not found with jwtKid = ${jwtKid}`);

  // TODO: Using the x5c property build a certificate which will be used to verify the JWT signature
  const { x5c } = signatureVerificationKey;
  const certificate = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`;

  return verify(token, certificate, { algorithms: ["RS256"] }) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}
