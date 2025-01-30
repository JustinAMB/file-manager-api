import { GenericResultDto } from "src/core/shared/dto/response";

export class UserDto {
  id: number;
  username: string;
  email: string;
  token?: string;
}
export class UserResultDto extends GenericResultDto {
  data: UserDto;
}
