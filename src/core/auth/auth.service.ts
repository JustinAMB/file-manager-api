import { Injectable } from "@nestjs/common";
import { EncryptClass } from "../shared/services/encrypt.class";
import { UserResultDto } from "./dto/response";
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from "./dto/dto";
import { PrismaService } from "../shared/services/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { GenericResultDto } from "../shared/dto/response";
import { EmailService } from "../shared/services/email.service";

@Injectable()
export class AuthService {
  constructor(
    private _encript: EncryptClass,
    private _prismaService: PrismaService,
    private _jwtService: JwtService,
    private _emailService: EmailService,
  ) {}
  async register(request: RegisterDto): Promise<UserResultDto> {
    const result = new UserResultDto();
    try {
      const findUser = await this._prismaService.user.findFirst({
        where: {
          email: {
            equals: request.email,
          },
        },
      });
      if (!findUser) {
        const newPassword = await this._encript.encryptPassword(
          request.password,
        );
        const user = await this._prismaService.user.create({
          data: {
            email: request.email,
            password: newPassword,
            username: request.username,
          },
        });
        result.data = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
        result.StatusCode = 1;
        result.Message = "Success";
      } else {
        result.StatusCode = -3;
        result.Message = "This email exist";
      }
    } catch (err) {
      console.log(err);
      result.StatusCode = -1;
      result.Message = "Error";
    }
    return result;
  }
  async login(request: LoginDto): Promise<UserResultDto> {
    const result = new UserResultDto();
    try {
      const findUser = await this._prismaService.user.findFirst({
        where: {
          email: {
            equals: request.email,
          },
        },
      });
      if (findUser) {
        const isMatch = this._encript.comparePassword(
          findUser.password,
          request.password,
        );
        const token = await this._jwtService.signAsync({ id: findUser.id });
        if (isMatch) {
          result.data = {
            id: findUser.id,
            email: findUser.email,
            username: findUser.username,
            token,
          };
          result.StatusCode = 1;
          result.Message = "Success";
        } else {
          result.Message = "Password invalid";
          result.StatusCode = -6;
        }
      } else {
        result.Message = "User not fund";
        result.StatusCode = -5;
      }
    } catch {
      result.StatusCode = -1;
      result.Message = "Error";
    }
    return result;
  }

  async forgotPassword(request: ForgotPasswordDto): Promise<GenericResultDto> {
    const result = new GenericResultDto();
    try {
      const findUser = await this._prismaService.user.findFirst({
        where: {
          email: {
            equals: request.email,
          },
        },
      });
      if (findUser) {
        const token = await this._jwtService.signAsync({ id: findUser.id });
        const html = `
        <h3 class="email__header-text">Hola, ${findUser.username}!</h3>
        <p >
        Hemos recibido una solicitud para recuperar tu contraseña  con el correo
        <strong>${findUser.email}</strong>, si fuiste tu
        ingresa al siguiente link para restaurarla
      </p>
      <a href="${process.env.FRONTEND_RESET_URL}/${token}">aqui</a>
        `;
        await this._emailService.sendEmail(
          findUser.email,
          "reset password",
          html,
        );
        result.StatusCode = 1;
        result.Message =
          "An email has been sent to you with the steps to follow.";
      } else {
        result.Message = "User not fund";
        result.StatusCode = -5;
      }
    } catch {
      result.StatusCode = -1;
      result.Message = "Error";
    }
    return result;
  }

  async resetPassword(request: ResetPasswordDto): Promise<GenericResultDto> {
    const result = new GenericResultDto();
    try {
      const { id } = await this._jwtService.verifyAsync(request.token, {
        secret: process.env.JWT_SECRET,
      });
      const findUser = await this._prismaService.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (findUser) {
        const newPassword = await this._encript.encryptPassword(
          request.password,
        );
        this._prismaService.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            password: {
              set: newPassword,
            },
          },
        });
      } else {
        result.Message = "Token invalid";
        result.StatusCode = -5;
      }
    } catch {
      result.StatusCode = -1;
      result.Message = "Error";
    }
    return result;
  }
}
