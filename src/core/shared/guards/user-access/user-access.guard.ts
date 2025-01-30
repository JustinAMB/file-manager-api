import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(private _jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      let req: Request = context.switchToHttp().getRequest();
      let _token: string = req.headers["authorization"];
      if (!_token) {
        throw new HttpException("Unauthorized", 401);
      }
      const { id } = await this._jwtService.verifyAsync(_token, {
        secret: process.env.JWT_SECRET,
      });
      if (!id) {
        throw new HttpException("Unauthorized", 401);
      } else {
        req.body["userId"] = Number(id);
      }
      return true;
    } catch {
      throw new HttpException("Unauthorized", 401);
    }
  }
}
