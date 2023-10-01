import jwt from 'jsonwebtoken'
import { envs } from './envs';

const JWT_SECRET = envs.JWT_SECRET;

export class JwtAdapter {
    static async generateToken( payload: any, duration: string= '2h'){

        return new Promise((resolve, reject) => {
            jwt.sign(payload, JWT_SECRET, { expiresIn: duration }, (err, token) => {
                if(err) resolve(err);

                resolve(token);
            });
        });

    }

    static verifyToken( token: string ): any {

        return new Promise((resolve) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if(err) resolve(null);

                resolve(decoded);
            });
        });
    }
}