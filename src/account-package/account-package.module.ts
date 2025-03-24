import { Module } from '@nestjs/common';
import { AccountPackageController } from './account-package.controller';
import { AccountPackageService } from './account-package.service';

@Module({
  controllers: [AccountPackageController],
  providers: [AccountPackageService],
})
export class AccountPackageModule {}
