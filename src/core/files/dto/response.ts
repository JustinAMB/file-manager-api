import { GenericResultDto } from "src/core/shared/dto/response";
export class FileDto {
  id: number;
  name: string;
  path: string;
  key: string;
}
export class FileResultsDto extends GenericResultDto {
  data: FileDto[];
}
