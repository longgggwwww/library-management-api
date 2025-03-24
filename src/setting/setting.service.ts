import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async find() {
    return this.prisma.setting.findFirst({
      include: {
        defaultUserRole: true,
      },
    });
  }

  async update(dto: UpdateSettingDto) {
    return this.prisma.setting.upsert({
      where: {
        id: 1,
      },
      create: {
        defaultUserRoleId: dto.defaultRoleId,
      },
      update: {
        defaultUserRoleId: dto.defaultRoleId,
      },
      include: {
        defaultUserRole: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }
}
