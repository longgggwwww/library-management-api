import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
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
import { CreatePublicationDto } from './dto/create-publication.dto';
import { FindPublicationDto } from './dto/find-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationService } from './publication.service';

@UseGuards(BranchAccessGuard)
@Controller('publications')
export class PublicationController {
    constructor(private readonly pub: PublicationService) {}

    // --------- Monitor routes ---------------

    @PublicBranch()
    @Get('branch/:branch_id')
    findByBranch(
        @Param('branch_id', ParseIntPipe) branchId: number,
        @Query() dto: FindPublicationDto,
    ) {
        return this.pub.findMany(branchId, dto);
    }

    // ----------------------------------------

    @Post()
    create(@UserCtx() user: User, @Body() dto: CreatePublicationDto) {
        return this.pub.create(user.id, user.branchId, dto);
    }

    @Get()
    findMany(@UserCtx() user: User, @Query() dto: FindPublicationDto) {
        return this.pub.findMany(user.branchId, dto);
    }

    @Get(':id')
    find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.pub.find(user.branchId, id);
    }

    @Patch(':id')
    update(
        @UserCtx() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePublicationDto,
    ) {
        return this.pub.update(user.branchId, id, dto);
    }

    @PublicBranch()
    @Post(':id/upload')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = path.join(
                        process.cwd(),
                        'uploads',
                        'publications',
                    );
                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueName = uniqueFilename(file.originalname);
                    cb(null, uniqueName);
                },
            }),
            fileFilter: (req, file, cb) => {
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
        @UserCtx() user: User,
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const photoUrl = `/publications/photo/${file.filename}`;
        return this.pub.updateCover(user.branchId, id, photoUrl);
    }

    @PublicBranch()
    @Get('photo/:filename')
    getPhoto(@Param('filename') filename: string, @Res() res: Response) {
        const photoPath = path.join(
            process.cwd(),
            'uploads',
            'publications',
            filename,
        );
        if (!fs.existsSync(photoPath)) {
            res.status(404).send('File not found');
        }
        return res.sendFile(photoPath);
    }
}
