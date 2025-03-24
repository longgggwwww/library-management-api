import { Module } from '@nestjs/common';
import { CustomPrismaModule } from 'nestjs-prisma';
import { ExtendedPrismaConfigService } from 'src/custom-prisma/custom-prisma.service';
import { PermGroupController } from './perm-group.controller';
import { PermGroupService } from './perm-group.service';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: 'CUSTOM_PRISMA',
      useClass: ExtendedPrismaConfigService,
    }),
  ],
  controllers: [PermGroupController],
  providers: [PermGroupService],
})
export class PermGroupModule {}
