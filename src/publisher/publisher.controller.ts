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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/types/user.type';
import { BranchAccessGuard } from 'src/branch/branch-access.guard';
import { PublicBranch } from 'src/branch/decorators/public-branch.decorator';
import { uniqueFilename } from 'utils/file-utils';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { FindPublisherDto } from './dto/find-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherService } from './publisher.service';

@UseGuards(BranchAccessGuard)
@Controller('publishers')
export class PublisherController {
  constructor(private readonly pub: PublisherService) {}

  // Endpoint này sẽ tìm kiếm nhiều publisher theo branch
  @PublicBranch() // Endpoint này không cần quyền truy cập
  @Get('branch/:branch_id')
  findByBranch(
    @Param('branch_id', ParseIntPipe) branchId: number,
    @Query() dto: FindPublisherDto, // Thêm decorator @Query() để lấy query params
  ) {
    return this.pub.findMany(branchId, dto);
  }

  // Endpoint này sẽ tạo mới một publisher
  @Post()
  create(
    // Thêm decorator @UserCtx() để lấy thông tin người dùng
    @UserCtx() user: User,
    @Body() dto: CreatePublisherDto,
  ) {
    return this.pub.create(user.id, user.branchId, dto);
  }

  // Endpoint này sẽ tìm nhiều publisher
  @Get()
  findMany(@UserCtx() user: User, @Query() dto: FindPublisherDto) {
    return this.pub.findMany(user.branchId, dto);
  }

  // Endpoint này sẽ tìm một publisher theo ID
  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.pub.find(user.branchId, id);
  }

  // Endpoint này sẽ cập nhật thông tin một publisher
  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePublisherDto,
  ) {
    return this.pub.update(user.branchId, id, dto);
  }

  // Endpoint này sẽ xóa nhiều publisher cùng lúc
  @Delete('batch')
  deleteBatch(
    @UserCtx() user: User,
    // Thêm decorator @Query() để lấy danh sách ID cần xóa
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
      }),
    )
    ids: number[],
  ) {
    return this.pub.deleteBatch(user.branchId, ids);
  }

  // Endpoint này sẽ xóa một publisher theo ID
  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.pub.delete(user.branchId, id);
  }

  // Endpoint này sẽ upload ảnh cho publisher
  @PublicBranch()
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          // Tạo thư mục uploads/publishers nếu chưa tồn tại
          const uploadPath = path.join(process.cwd(), 'uploads', 'publishers');
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
        // Chỉ cho phép upload file ảnh
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
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Kiểm tra file có tồn tại không
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const photoUrl = `/publishers/photo/${file.filename}`;
    return this.pub.updatePhoto(user.branchId, id, photoUrl); // Cập nhật URL ảnh vào database
  }

  // Endpoint này sẽ trả về ảnh của publisher
  @PublicBranch() // Endpoint này không cần quyền truy cập vào branch
  @Get('photo/:filename')
  getPhoto(@Param('filename') filename: string, @Res() res: Response) {
    // Tìm đường dẫn của ảnh
    const photoPath = path.join(
      process.cwd(),
      'uploads',
      'publishers',
      filename,
    );
    // Nếu ảnh không tồn tại, trả về lỗi 404
    if (!fs.existsSync(photoPath)) {
      return res.status(404).send('File not found');
    }
    return res.sendFile(photoPath);
  }
}
