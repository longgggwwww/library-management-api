import {
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
    UseGuards,
} from '@nestjs/common';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/types/user.type';
import { BranchAccessGuard } from 'src/branch/branch-access.guard';
import { PublicBranch } from 'src/branch/decorators/public-branch.decorator';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { LanguageService } from './language.service';

// BranchAccessGuard sẽ kiểm tra quyền truy cập vào branch của người dùng
@UseGuards(BranchAccessGuard)
@Controller('languages')
export class LanguageController {
    constructor(private readonly lang: LanguageService) {}

    // Endpoint này sẽ tìm kiếm nhiều language theo branch
    @PublicBranch() // Endpoint này không cần quyền truy cập
    @Get('branch/:branch_id')
    findBySchool(@Param('branch_id', ParseIntPipe) branchId: number) {
        return this.lang.findMany(branchId);
    }

    // Endpoint này sẽ tạo mới một language
    @Post()
    create(
        // Lấy thông tin người dùng từ decorator UserCtx
        @UserCtx() user: User,
        @Body() dto: CreateLanguageDto,
    ) {
        return this.lang.create(user.branchId, dto);
    }

    // Endpoint này sẽ tìm kiếm nhiều language theo branch
    @Get()
    findMany(@UserCtx() user: User) {
        return this.lang.findMany(user.branchId);
    }

    // Endpoint này sẽ tìm kiếm một language
    @Get(':id')
    find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.lang.find(user.branchId, id);
    }

    // Endpoint này sẽ cập nhật một language
    @Patch(':id')
    update(
        @UserCtx() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateLanguageDto,
    ) {
        return this.lang.update(user.branchId, id, dto);
    }

    // Endpoint này sẽ xóa nhiều language
    @Delete('batch')
    deleteBatch(
        @UserCtx() user: User,
        // Lấy danh sách id từ query
        @Query(
            'ids',
            new ParseArrayPipe({
                items: Number,
            }),
        )
        ids: number[],
    ) {
        return this.lang.deleteBatch(user.branchId, ids);
    }

    // Endpoint này sẽ xóa một language
    @Delete(':id')
    delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.lang.delete(user.branchId, id);
    }
}
