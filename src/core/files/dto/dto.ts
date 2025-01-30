import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from "class-validator";
import { SessionUserDto } from "src/core/shared/dto/dto";

export class FileSearchRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  page: number;
}
export class SaveFileDto extends SessionUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;
}

export class SaveFileExternalDto extends SessionUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;
}
