import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/types/user.type';
import { uniqueFilename } from 'utils/file-utils';
import { AssignBranchDto } from './dto/assign-branch.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto, CreateUsersListDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import {
  ChangePwdDto,
  ResetUserPwdDto,
  UpdateInfoDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Post(':target_id/role')
  assignRole(
    @UserCtx() user: User,
    @Param('target_id', ParseIntPipe) targetId: number,
    @Body() dto: AssignRoleDto,
  ) {
    return this.user.assignRole(user.id, targetId, dto);
  }

  @Post(':target_id/branch/assign')
  assignBranch(
    @UserCtx() user: User,
    @Param('target_id', ParseIntPipe) targetId: number,
    @Body() dto: AssignBranchDto,
  ) {
    return this.user.assignBranch(user.id, targetId, dto);
  }

  @Post('batch')
  createBatch(@Body() dto: CreateUsersListDto) {
    return this.user.createBatch(dto);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.user.create(dto);
  }

  @Get('current')
  findInfo(@UserCtx() user: User) {
    return this.user.find(user.id);
  }

  @Get()
  findMany(@Query() dto: FindUserDto) {
    return this.user.findMany(dto);
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.user.find(id);
  }

  @Patch('current')
  updateProf(@UserCtx() user: User, @Body() dto: UpdateInfoDto) {
    return this.user.updateProf(user.id, dto);
  }

  @Patch(':user_id/password/reset')
  resetPwd(
    @Param('user_id', ParseIntPipe) userId: number,
    @Body() dto: ResetUserPwdDto,
  ) {
    return this.user.resetPwd(userId, dto);
  }

  @Patch('password/change')
  changePwd(@UserCtx() user: User, @Body() dto: ChangePwdDto) {
    return this.user.changePwd(user.id, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.user.update(id, dto);
  }

  @Delete('batch')
  deleteBatch(
    @Query('ids', new ParseArrayPipe({ items: Number })) ids: number[],
  ) {
    return this.user.deleteBatch(ids);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.user.delete(id);
  }

  @Post('photo/upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploads', 'users');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueName = uniqueFilename(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 16 * 1024 * 1024 }, // 16MB
    }),
  )
  uploadFile(@UserCtx() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const photoUrl = `/users/photo/${file.filename}`;
    return this.user.updatePhoto(user.id, photoUrl);
  }

  @Get('photo/:filename')
  findPhoto(@Param('filename') fname: string, @Res() res: Response) {
    const photoPath = path.join(process.cwd(), 'uploads', 'users', fname);
    if (!fs.existsSync(photoPath)) {
      return res.status(404).send('File not found');
    }
    res.sendFile(photoPath);
  }
}
