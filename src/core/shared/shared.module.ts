import { Module } from "@nestjs/common";
import { PrismaService } from "./services/prisma.service";
import { EncryptClass } from "./services/encrypt.class";
import { EmailService } from "./services/email.service";

@Module({
  providers: [PrismaService, EncryptClass, EmailService],
  exports: [PrismaService, EncryptClass, EmailService],
})
export class SharedModule {}
