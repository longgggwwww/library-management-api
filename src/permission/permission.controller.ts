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
import { PermService } from './permission.service';

@Controller('permissions')
export class PermController {
  constructor(private readonly perm: PermService) {}

  // Tạo một permission mới
  @Permit('CREATE_PERMISSION')
  @Post()
  create(@Body() dto: CreatePermDto) {
    return this.perm.create(dto);
  }

  // Tìm kiếm nhiều permission
  @Permit('VIEW_PERMISSION')
  @Get()
  findMany() {
    return this.perm.findMany();
  }

  // Tìm kiếm một permission
  @Get(':id')
  find(@Param('id') id: string) {
    return this.perm.find(id);
  }

  // Cập nhật một permission
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermDto) {
    return this.perm.update(id, dto);
  }

  // Xoá nhiều permission
  @Delete('batch')
  deleteMany(
    @Body('ids', new ParseArrayPipe({ items: String }))
    ids: string[],
  ) {
    return this.perm.deleteMany(ids);
  }

  // Endpoint này sẽ xóa một permission
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.perm.delete(id);
  }
}
