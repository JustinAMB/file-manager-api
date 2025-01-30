export class GenericResultDto {
  IdTypeStatusCode?: number;
  StatusCode: number;

  Message: string;

  Messages: string[];

  constructor() {
    this.Message = "";
    this.IdTypeStatusCode = 0;
    this.StatusCode = 0;
  }
}
