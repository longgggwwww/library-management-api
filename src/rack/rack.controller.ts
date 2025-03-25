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
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/types/user.type';
import { Permit } from 'src/permission/decorators/permit.decorator';
import { CreateRackDto } from './dto/create-rack.dto';
import { UpdateRackDto } from './dto/update-rack.dto';
import { RackService } from './rack.service';

@Controller('racks')
export class RackController {
  constructor(private readonly rack: RackService) {}

  @Permit('CREATE_INVENTORY')
  @Post()
  create(@UserCtx() user: User, @Body() dto: CreateRackDto) {
    return this.rack.create(user.branchId, dto);
  }

  @Get('shelf/:shelfId')
  findMany(
    @UserCtx() user: User,
    @Param('shelfId', ParseIntPipe) shelfId: number,
  ) {
    return this.rack.findMany(user.branchId, shelfId);
  }

  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.rack.find(user.branchId, id);
  }

  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRackDto,
  ) {
    return this.rack.update(user.branchId, id, dto);
  }

  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.rack.delete(user.branchId, id);
  }
}
