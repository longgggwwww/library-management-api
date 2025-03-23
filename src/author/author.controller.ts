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
import { User } from '@prisma/client';
import { Response } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { BranchAccessGuard } from 'src/branch/branch-access.guard';
import { PublicBranch } from 'src/branch/decorators/public-branch.decorator';
import { Permit } from 'src/permission/decorators/permit.decorator';
import { uniqueFilename } from 'utils/file-utils';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@UseGuards(BranchAccessGuard)
@Controller('authors')
export class AuthorController {
    constructor(private readonly author: AuthorService) {}

    // Lấy danh sách tác giả theo branch
    @PublicBranch()
    @Permit('VIEW_AUTHOR')
    @Get('branch/:branch_id')
    findByBranch(@Param('branch_id', ParseIntPipe) branchId: number) {
        return this.author.findMany(branchId);
    }

    // Tạo mới tác giả
    @Permit('CREATE_AUTHOR')
    @Post()
    create(@UserCtx() user: User, @Body() newAuthorData: CreateAuthorDto) {
        return this.author.create(user.branchId, newAuthorData);
    }

    // Endpoint này sẽ lấy danh sách tác giả
    @Permit('VIEW_AUTHOR') // Người dùng cần có quyền 'MODIFY_AUTHOR' hoặc 'MODIFY_PUBLICATION' mới có thể truy cập
    @Get()
    findMany(
        // Thêm decorator @UserCtx() để lấy thông tin người dùng
        @UserCtx() user: User,
    ) {
        return this.author.findMany(user.branchId);
    }

    // Endpoint này sẽ tìm tác giả theo ID
    @Permit('VIEW_AUTHOR')
    @Get(':id')
    find(
        // Thêm decorator @UserCtx() để lấy thông tin người dùng
        @UserCtx() user: User,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.author.find(user.branchId, id);
    }

    // Endpoint này sẽ cập nhật thông tin tác giả
    @Permit('UPDATE_AUTHOR')
    @Patch(':id')
    update(
        // Thêm decorator @UserCtx() để lấy thông tin người dùng
        @UserCtx() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAuthorDto,
    ) {
        return this.author.update(user.branchId, id, dto);
    }

    // Endpoint này sẽ xóa nhiều tác giả cùng lúc
    @Permit('DELETE_AUTHOR')
    @Delete('batch')
    deleteBatch(
        // Thêm decorator @UserCtx() để lấy thông tin người dùng
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
        return this.author.deleteBatch(user.branchId, ids);
    }

    // Endpoint này sẽ xóa tác giả theo ID
    @Permit('DELETE_AUTHOR')
    @Delete(':id')
    delete(
        // Thêm decorator @UserCtx() để lấy thông tin người dùng
        @UserCtx() user: User,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.author.delete(user.branchId, id);
    }

    // Endpoint này sẽ upload ảnh cho tác giả
    @Permit('UPDATE_AUTHOR')
    @Post(':id/upload')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: (_req, _file, cb) => {
                    // Tạo thư mục uploads/authors nếu nó chưa tồn tại
                    const uploadPath = path.join(
                        process.cwd(),
                        'uploads',
                        'authors',
                    );
                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true });
                    }

                    cb(null, uploadPath);
                },
                filename: (_req, file, cb) => {
                    const uniqueName = uniqueFilename(file.originalname); // Example: 1234567890-abc.jpg
                    cb(null, uniqueName);
                },
            }),
            fileFilter: (_req, file, cb) => {
                // Chỉ cho phép upload file ảnh
                const allowedMimeTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/jpg',
                ];
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return cb(
                        new Error('Only image files are allowed!'),
                        false,
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 16 * 1024 * 1024 }, // 16MB
        }),
    )
    uploadFile(
        // Thêm decorator @UserCtx() để lấy thông tin người dùng
        @UserCtx() user: User,
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        // Nếu không có file, ném ra lỗi BadRequest
        if (!file) throw new BadRequestException('File is required');
        // Tạo URL cho ảnh
        const photoUrl = `/authors/photo/${file.filename}`;
        // Cập nhật URL ảnh vào database
        return this.author.updatePhoto(user.branchId, id, photoUrl);
    }

    // Endpoint này sẽ trả về ảnh theo tên file
    @PublicBranch() // Endpoint này không cần kiểm tra branch của người dùng
    @Get('photo/:filename')
    getPhoto(@Param('filename') filename: string, @Res() res: Response) {
        const photoPath = path.join(
            process.cwd(),
            'uploads',
            'authors',
            filename,
        );
        if (!fs.existsSync(photoPath)) {
            return res.status(404).send('File not found');
        }
        return res.sendFile(photoPath);
    }
}
