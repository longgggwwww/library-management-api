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
import { User } from '@prisma/client';
import { Response } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { Permit } from 'src/permission/decorators/permit.decorator';
import { uniqueFilename } from 'utils/file-utils';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { FindBranchDto } from './dto/find-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
export class BranchController {
  constructor(private readonly branch: BranchService) {}

  // Endpoint này sẽ tạo mới một branch
  @Permit('CREATE_BRANCH')
  @Post()
  create(@Body() dto: CreateBranchDto) {
    return this.branch.create(dto);
  }

  // Endpoint này sẽ tìm kiếm nhiều branch
  @Get()
  findMany(@Query() dto: FindBranchDto) {
    return this.branch.findMany(dto);
  }

  // Endpoint này sẽ trả về branch hiện tại của người dùng
  @Get('current')
  findCurrent(@UserCtx() user: User) {
    return this.branch.find(user.branchId);
  }

  // Endpoint này sẽ tìm branch theo ID
  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.branch.find(id);
  }

  // Endpoint này sẽ cập nhật thông tin branch
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBranchDto) {
    return this.branch.update(id, dto);
  }

  // Endpoint này sẽ xóa nhiều branch
  @Delete('batch')
  deleteBatch(
    // Thêm decorator @Query() để lấy danh sách ID cần xóa
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
      }),
    )
    ids: number[],
  ) {
    return this.branch.deleteBatch(ids);
  }

  // Endpoint này sẽ xóa branch theo ID
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.branch.delete(id);
  }

  // Endpoint này sẽ upload ảnh cho branch
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          // Tạo thư mục uploads/branches nếu chưa tồn tại
          const uploadPath = path.join(process.cwd(), 'uploads', 'branches');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueName = uniqueFilename(file.originalname); // Tạo tên file duy nhất
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        // Chỉ chấp nhận file ảnh
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 16 * 1024 * 1024 }, // 16MB
    }),
  )
  uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Kiểm tra xem file có tồn tại không
    if (!file) throw new BadRequestException('File is required');
    const photoUrl = `/branches/photo/${file.filename}`;
    // Cập nhật ảnh cho branch
    return this.branch.updateLogo(id, photoUrl);
  }

  // Endpoint này sẽ trả về ảnh của branch
  @Get('photo/:filename')
  getPhoto(@Param('filename') filename: string, @Res() res: Response) {
    const photoPath = path.join(process.cwd(), 'uploads', 'branches', filename);
    if (!fs.existsSync(photoPath)) {
      return res.status(404).send('File not found');
    }
    return res.sendFile(photoPath);
  }
}
