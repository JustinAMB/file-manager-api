import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileResultsDto } from "./dto/response";
import { FilesService } from "./files.service";
import {
  FileSearchRequestDto,
  SaveFileDto,
  SaveFileExternalDto,
} from "./dto/dto";
import { SessionUserDto } from "../shared/dto/dto";
import { GenericResultDto } from "../shared/dto/response";
import { UserAccessGuard } from "../shared/guards/user-access/user-access.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("files")
export class FilesController {
  constructor(private _filesService: FilesService) {}
  /**
   * get files by user
   * @param query
   * @param body
   * @returns
   */
  @UseGuards(UserAccessGuard)
  @Get("/")
  async getFiles(
    @Query() query: FileSearchRequestDto,
    @Body() body,
  ): Promise<FileResultsDto> {
    const request: SessionUserDto = body;
    const result = await this._filesService.getFiles(
      query.name,
      query.page,
      request.userId,
    );
    return result;
  }

  /**
   * Save a file
   * @param file
   * @param request
   * @returns
   */
  @UseGuards(UserAccessGuard)
  @Post("/")
  @UseInterceptors(FileInterceptor("file"))
  async saveFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() request: SaveFileDto,
  ): Promise<GenericResultDto> {
    const result = await this._filesService.saveFile(request, file);
    return result;
  }

  /**
   * Save a file from an external provider via URL
   * @param request
   * @returns
   */
  @UseGuards(UserAccessGuard)
  @Post("/external")
  async saveFileOtherSite(
    @Body() request: SaveFileExternalDto,
  ): Promise<GenericResultDto> {
    const result = await this._filesService.saveFileOtherFile(request);
    return result;
  }
  @UseGuards(UserAccessGuard)
  @Get("/download/:key")
  async getFile(@Param("key") key: string): Promise<AWS.S3.GetObjectOutput> {
    const result = await this._filesService.getFileStream(key);
    return result;
  }
}
