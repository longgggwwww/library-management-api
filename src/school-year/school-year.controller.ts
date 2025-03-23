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
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { SchoolYearService } from './school-year.service';

// BranchAccessGuard sẽ kiểm tra quyền truy cập vào branch của người dùng
// Điều này có nghĩa là người dùng cần phải có quyền truy cập vào branch mới có thể truy cập vào các endpoint này
@UseGuards(BranchAccessGuard)
@Controller('school-years')
export class SchoolYearController {
    constructor(private readonly schoolYear: SchoolYearService) {}

    // Endpoint này sẽ tìm kiếm nhiều school year theo branch
    @PublicBranch()
    @Get('branch_id/public') // Endpoint này không cần quyền truy cập
    findPublic(@Param('branch_id', ParseIntPipe) branchId: number) {
        return this.schoolYear.findMany(branchId);
    }

    // Endpoint này sẽ tạo mới một school year
    @Post()
    create(
        // Lấy thông tin người dùng từ decorator UserCtx
        @UserCtx() user: User,
        @Body() dto: CreateSchoolYearDto,
    ) {
        return this.schoolYear.create(user.branchId, dto);
    }

    // Endpoint này sẽ tìm kiếm nhiều school year
    @Get()
    findMany(@UserCtx() user: User) {
        return this.schoolYear.findMany(user.branchId);
    }

    // Endpoint này sẽ tìm kiếm một school year
    @Get(':id')
    find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.schoolYear.find(user.branchId, id);
    }

    // Endpoint này sẽ cập nhật một school year
    @Patch(':id')
    update(
        @UserCtx() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSchoolYearDto,
    ) {
        return this.schoolYear.update(user.branchId, id, dto);
    }

    // Endpoint này sẽ xóa nhiều school year
    @Delete('batch')
    deleteBatch(
        @UserCtx() user: User,
        // ParseArrayPipe sẽ chuyển query param 'ids' thành một mảng các số nguyên
        @Query(
            'ids',
            new ParseArrayPipe({
                items: Number,
            }),
        )
        ids: number[],
    ) {
        return this.schoolYear.deleteBatch(user.branchId, ids);
    }

    // Endpoint này sẽ xóa một school year
    @Delete(':id')
    delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.schoolYear.delete(user.branchId, id);
    }
}
