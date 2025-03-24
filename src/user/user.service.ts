import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { hashPwd } from 'utils/hash-password';
import { AssignBranchDto } from './dto/assign-branch.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateManyUserDto, CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import {
  ChangePwdDto,
  ResetUserPwdDto,
  UpdateInfoDto,
  UpdateUserDto,
} from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async getDefaultRoleId() {
    const setting = await this.prisma.setting.findFirst({
      include: { defaultUserRole: true },
    });
    return setting.defaultUserRoleId;
  }

  private async findUserWithRelations(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        role: {
          include: { permissions: true },
        },
        branch: true,
      },
      omit: { password: true },
    });
  }

  private async updateUser(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        role: {
          include: { permissions: true },
        },
        branch: true,
      },
      omit: { password: true },
    });
  }

  async findUnique(input: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUniqueOrThrow({ where: input });
  }

  async createBatch(dto: CreateManyUserDto) {
    const { users } = dto;
    const defaultRoleId = await this.getDefaultRoleId();
    const hashedPwds = await Promise.all(
      users.map((usr) => hashPwd(usr.password)),
    );
    return this.prisma.user.createMany({
      data: users.map((usr, idx) => ({
        ...usr,
        password: hashedPwds[idx],
        roleId: usr.roleId ?? defaultRoleId,
      })),
      skipDuplicates: true,
    });
  }

  async create(dto: CreateUserDto) {
    const { password, roleId, ...usrData } = dto;
    if (!password) {
      throw new BadRequestException();
    }
    const hashedPwd = await hashPwd(password);
    const defaultRoleId = await this.getDefaultRoleId();
    return this.prisma.user.create({
      data: {
        ...usrData,
        password: hashedPwd,
        roleId: roleId ?? defaultRoleId,
      },
      include: {
        role: {
          include: { permissions: true },
        },
        branch: true,
      },
      omit: { password: true },
    });
  }

  async findMany(dto: FindUserDto) {
    const { id, take, skip, field, order } = dto;
    return this.prisma.user.findMany({
      cursor: id ? { id } : undefined,
      take,
      skip,
      orderBy: field ? { [field]: order } : undefined,
      include: {
        role: {
          include: { permissions: true },
        },
        branch: true,
      },
    });
  }

  async find(id: number) {
    return this.findUserWithRelations(id);
  }

  async update(id: number, dto: UpdateUserDto) {
    const { password, ...userData } = dto;
    const hashedPwd = await hashPwd(password);
    return this.updateUser(id, { ...userData, password: hashedPwd });
  }

  async updateProf(userId: number, dto: UpdateInfoDto) {
    return this.updateUser(userId, dto);
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: { id },
      include: {
        role: { include: { permissions: true } },
        branch: true,
      },
      omit: { password: true },
    });
  }

  async deleteBatch(ids: number[]) {
    return this.prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async assignRole(userId: number, targetId: number, dto: AssignRoleDto) {
    const { roleId } = dto;
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: targetId },
    });
    if (user.isAdmin || user.id === userId) {
      throw new BadRequestException();
    }
    await this.prisma.role.findFirstOrThrow({
      where: { id: roleId },
    });
    return this.updateUser(user.id, { roleId });
  }

  async assignBranch(userId: number, targetId: number, dto: AssignBranchDto) {
    const { branchId } = dto;
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: targetId },
    });
    if (user.isAdmin || user.id === userId) {
      throw new BadRequestException();
    }
    await this.prisma.branch.findFirstOrThrow({
      where: { id: branchId },
    });
    return this.updateUser(user.id, { branchId });
  }

  async resetPwd(userId: number, dto: ResetUserPwdDto) {
    const { password } = dto;
    const hashedPwd = await hashPwd(password);
    return this.updateUser(userId, { password: hashedPwd });
  }

  async changePwd(userId: number, dto: ChangePwdDto) {
    const { currentPassword: currPwd, newPassword: newPwd } = dto;
    const usr = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const isMatch = await bcrypt.compare(currPwd, usr.password);
    if (!isMatch) {
      throw new BadRequestException();
    }
    const hashedPwd = await hashPwd(newPwd);
    return this.updateUser(userId, { password: hashedPwd });
  }

  async updatePhoto(userId: number, photoUrl: string) {
    return this.updateUser(userId, { photoUrl });
  }
}
