import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseArrayPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { Permit } from './decorators/permit.decorator';
import { CreatePermDto } from './dto/create-permission.dto';
import { UpdatePermDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
    constructor(private readonly permission: PermissionService) {}

    // Tạo một permission mới
    @Permit('CREATE_PERMISSION')
    @Post()
    create(@Body() dto: CreatePermDto) {
        return this.permission.create(dto);
    }

    // Tìm kiếm nhiều permission
    @Permit('VIEW_PERMISSION')
    @Get()
    findMany() {
        return this.permission.findMany();
    }

    // Tìm kiếm một permission
    @Get(':id')
    find(@Param('id') id: string) {
        return this.permission.find(id);
    }

    // Cập nhật một permission
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePermDto) {
        return this.permission.update(id, dto);
    }

    // Xoá nhiều permission
    @Delete('batch')
    deleteMany(
        @Body('ids', new ParseArrayPipe({ items: String }))
        ids: string[],
    ) {
        return this.permission.deleteMany(ids);
    }

    // Endpoint này sẽ xóa một permission
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.permission.delete(id);
    }
}
