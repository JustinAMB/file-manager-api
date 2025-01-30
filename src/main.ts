import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * api documentation
   */
  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("API description")
    .setVersion("1.0")
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config); // Llama a la función aquí

  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(3000);
}
bootstrap();
