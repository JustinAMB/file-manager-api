import { IsOptional } from "class-validator";

export class SessionUserDto {
  @IsOptional()
  userId?: number;
}
