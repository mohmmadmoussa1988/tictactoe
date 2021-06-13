import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Tic Tac Toe API')
  .setDescription('Tic Tac Toe playing API')
  .setVersion('1.0')
  .build();
  const doc = SwaggerModule.createDocument(app,swaggerConfig);
  SwaggerModule.setup('api',app,doc);
  await app.listen(3000);
}
bootstrap();
