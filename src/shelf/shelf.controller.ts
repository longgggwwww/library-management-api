import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { ShelfService } from './shelf.service';

@Controller('shelfs')
export class ShelfController {
  constructor(private readonly shelf: ShelfService) {}

  @Post()
  create(@UserCtx() user: User, @Body() dto: CreateShelfDto) {
    return this.shelf.create(user.branchId, dto);
  }

  @Get()
  findMany(@UserCtx() user: User) {
    return this.shelf.findMany(user.branchId);
  }

  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.shelf.find(user.branchId, id);
  }

  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShelfDto,
  ) {
    return this.shelf.update(user.branchId, id, dto);
  }

  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.shelf.delete(user.branchId, id);
  }
}
