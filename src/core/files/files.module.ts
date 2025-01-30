import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { SharedModule } from "../shared/shared.module";

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [SharedModule],
})
export class FilesModule {}
