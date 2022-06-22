import { SECRET_KEY } from "../config/constants";
import jwt from 'jsonwebtoken';
class JWT {
    private secretKey = SECRET_KEY as string;

    sign(data: any): string {
        //console.log(this.secretKey)
        //console.log(jwt.sign({ user: data}, `ismaelosuna`, { expiresIn: '25d'}))
        return jwt.sign({ user: data}, `${this.secretKey}`, { expiresIn: '25d'});
    }

    verify(token: string): string {
        //console.log(token);
        try {
            return jwt.verify(token, this.secretKey) as string;
        } catch (e) {
            return 'false';
        }
    }
}

export default JWT;