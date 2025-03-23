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
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private readonly role: RoleService) {}

    // Endpoint này sẽ tạo một role mới
    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.role.create(dto);
    }

    // Endpoint này sẽ trả về tất cả các role
    @Get()
    findMany() {
        return this.role.findMany();
    }

    // Endpoint này sẽ trả về role với id tương ứng
    @Get(':id')
    find(@Param('id', ParseIntPipe) id: number) {
        return this.role.find(id);
    }

    // Endpoint này sẽ cập nhật role với id tương ứng
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
        return this.role.update(id, dto);
    }

    // Endpoint này sẽ xóa nhiều role
    @Delete('batch')
    deleteBatch(
        // Sử dụng ParseArrayPipe để chuyển đổi chuỗi thành mảng số
        @Query(
            'ids',
            new ParseArrayPipe({
                items: Number,
            }),
        )
        ids: number[],
    ) {
        return this.role.deleteBatch(ids);
    }

    // Endpoint này sẽ xóa role với id tương ứng
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.role.delete(id);
    }
}
