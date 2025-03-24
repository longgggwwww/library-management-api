import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { port } from './common/constants/env-keys';
import { TrimPipe } from './pipes/trim.pipe';

async function bootstrap() {
  // Tạo ứng dụng NestJS
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
      credentials: false,
    },
  });

  // Sử dụng các pipe toàn cục cho việc xác thực và loại bỏ khoảng trắng
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
    new TrimPipe(),
  );

  // Sử dụng bộ lọc toàn cục để xử lý ngoại lệ của Prisma client
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Khởi động ứng dụng trên cổng được chỉ định
  await app.listen(port);

  console.log(`App is running on port: ${port}✨`);
}
bootstrap();
