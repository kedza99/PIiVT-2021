import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import Config from '../config/dev';
import ITokenData from '../components/auth/dto/ITokenData.interface';

interface TokenValidationInformation {
    isValid: boolean;
    data: any;
}

export default class AuthMiddleware {
    private static verifyAuthToken(req: Request, res: Response, next: NextFunction) {
        if (Config.auth.allowRequestsEvenWithoutValidTokens) {
            return next();
        }

        if (typeof req.headers.authorization !== "string") {
            return res.status(401).send("No auth token specified.");
        }

        const token: string = req.headers.authorization;

        const [ tokenType, tokenString ] = token.trim().split(" ");

        if ( tokenType !== "Bearer" ) {
            return res.status(401).send("Invalid auth token type specified.");
        }

        if ( typeof tokenString !== "string" || tokenString.length === 0 ) {
            return res.status(401).send("Invalid auth token length.");
        }

        const administratorTokenValidation= this.validateTokenAsAdministrator(tokenString);

        let result;

        if (administratorTokenValidation.isValid === false) {
            return res.status(401).send("Token validation error: " + JSON.stringify(administratorTokenValidation));
        }

        result = administratorTokenValidation.data;
        
        if (typeof result !== "object") {
            return res.status(401).send("Bad auth token data.");
        }

        const data: ITokenData = result as ITokenData;

        req.authorized = data;

        next();
    }

    private static validateTokenAsAdministrator(tokenString: string): TokenValidationInformation {
        try {
            const result = jwt.verify(tokenString, Config.auth.administrator.auth.public);
            return {
                isValid: true,
                data: result,
            };
        } catch (e) {
            return {
                isValid: false,
                data: e?.message,
            };
        }
    }

     public static getVerifier(): (req: Request, res: Response, next: NextFunction) => void {
         return (req: Request, res: Response, next: NextFunction) => {
             this.verifyAuthToken(req, res, next);
         };
     }
}
