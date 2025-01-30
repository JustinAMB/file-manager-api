import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { PrismaService } from "../shared/services/prisma.service";
import { FileResultsDto } from "./dto/response";
import { GenericResultDto } from "../shared/dto/response";
import { SaveFileDto, SaveFileExternalDto } from "./dto/dto";
import axios from "axios";
import { Readable } from "node:stream";

@Injectable()
export class FilesService {
  constructor(private _prismaService: PrismaService) {}
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  });

  async uploadFile(data, mimetype): Promise<AWS.S3.ManagedUpload.SendData> {
    const current = new Date();
    const file = await this.s3Upload(
      data,
      process.env.S3_BUCKET,
      `${current.getTime()}`,
      mimetype,
    );
    return file;
  }

  async s3Upload(
    file,
    bucket: string,
    name: string,
    mimetype: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: "public-read",
      ContentType: mimetype,
      ContentDisposition: "inline",
      CreateBucketConfiguration: {
        LocationConstraint: "ap-south-1",
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      return null;
    }
  }
  async getFiles(
    name: string,
    page: number,
    userId: number,
  ): Promise<FileResultsDto> {
    const result = new FileResultsDto();
    try {
      page = page ? page : 0;
      const files = await this._prismaService.file.findMany({
        take: 10,
        skip: (page - 1) * 10,
        where: {
          AND: [
            {
              name: {
                contains: name,
              },
            },
            {
              userId: {
                equals: userId,
              },
            },
          ],
        },
      });
      result.data = files.map((item) => ({
        id: item.id,
        name: item.name,
        path: item.path,
        key: item.key,
      }));
      result.Message = "Success";
      result.StatusCode = 1;
    } catch (err) {
      result.StatusCode = -1;
      result.Message = "error";
    }
    return result;
  }
  async saveFile(
    request: SaveFileDto,
    file: Express.Multer.File,
  ): Promise<GenericResultDto> {
    const result = new GenericResultDto();
    try {
      const fileData = await this.uploadFile(file.buffer, file.mimetype);
      if (fileData?.Location) {
        this._prismaService.file.create({
          data: {
            path: fileData.Location,
            userId: request.userId,
            name: request.name,
            key: fileData.Key,
          },
        });
        result.Message = "success";
        result.StatusCode = 1;
      } else {
        result.Message = "error";
        result.StatusCode = -1;
      }
    } catch (err) {
      result.Message = "error";
      result.StatusCode = -1;
    }
    return result;
  }
  async saveFileOtherFile(
    request: SaveFileExternalDto,
  ): Promise<GenericResultDto> {
    const result = new GenericResultDto();
    try {
      const response = await axios.get(request.url, {
        responseType: "arraybuffer",
      });
      const fileData = await this.uploadFile(response.data, "image/jpeg");
      if (fileData?.Location) {
        this._prismaService.file.create({
          data: {
            path: fileData.Location,
            userId: request.userId,
            name: fileData.Key,
            key: fileData.Key,
          },
        });
        result.Message = "success";
        result.StatusCode = 1;
      } else {
        result.Message = "error";
        result.StatusCode = -1;
      }
    } catch (err) {
      result.Message = "error";
      result.StatusCode = -1;
    }
    return result;
  }

  async getFileStream(fileKey: string): Promise<AWS.S3.GetObjectOutput> {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      };
      const result = this.s3.getObject(params).promise();
      return result;
    } catch (err) {
      return null;
    }
  }
}
