import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from "./dto/dto";
import { UserResultDto } from "./dto/response";
import { GenericResultDto } from "../shared/dto/response";

@Controller("auth")
export class AuthController {
  constructor(private _authService: AuthService) {}
  /**
   * register user account
   * @param request 
   * @returns 
   */
  @Post("register")
  async register(@Body() request: RegisterDto): Promise<UserResultDto> {
    const result = await this._authService.register(request);
    return result;
  }
  /**
   * generates the user session
   * @param request 
   * @returns 
   */
  @Post("login")
  async login(@Body() request: LoginDto): Promise<UserResultDto> {
    const result = await this._authService.login(request);
    return result;
  }
  /**
   * the url to recover the password is generated
   * @param request 
   * @returns 
   */
  @Post("forgot-password")
  async forgotPassword(
    @Body() request: ForgotPasswordDto,
  ): Promise<GenericResultDto> {
    const result = await this._authService.forgotPassword(request);
    return result;
  }
  /**
   * The password is reset using the token
   * @param request 
   * @returns 
   */
  @Post("reset-password")
  async resetPassword(
    @Body() request: ResetPasswordDto,
  ): Promise<GenericResultDto> {
    const result = await this._authService.resetPassword(request);
    return result;
  }
}
