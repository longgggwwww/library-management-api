import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AccountPackageController } from './account-package.controller';
import { AccountPackageService } from './account-package.service';

@Module({
  imports: [
    // Sử dụng CustomPrismaModule để kết nối với database
    // CustomPrismaModule.forRootAsync({
    //     isGlobal: true,
    //     name: 'CUSTOM_PRISMA_CLIENT',
    //     useClass: ExtendedPrismaConfigService,
    // }),
  ],
  controllers: [AccountPackageController],
  providers: [AccountPackageService, PrismaService],
})
export class AccountPackageModule {}
