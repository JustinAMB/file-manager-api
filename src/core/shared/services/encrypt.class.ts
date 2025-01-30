import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

@Injectable()
export class EncryptClass {
  constructor() {}

  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password, salt);
    return encryptPassword;
  }

  async comparePassword(
    password: string,
    receivedPassword: string,
  ): Promise<boolean> {
    const isEquals = await bcrypt.compare(password, receivedPassword);
    return isEquals;
  }
}
