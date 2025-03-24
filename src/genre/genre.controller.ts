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
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreService } from './genre.service';

// Các endpoint trong controller này sẽ được bảo vệ bởi BranchAccessGuard
// Điều này có nghĩa là người dùng cần phải có quyền truy cập vào branch mới có thể truy cập vào các endpoint này
@UseGuards(BranchAccessGuard)
@Controller('genres')
export class GenreController {
  constructor(private readonly genre: GenreService) {}

  // Endpoint này sẽ tìm kiếm nhiều genre theo branch
  @PublicBranch() // Endpoint này không cần quyền truy cập
  @Get('branch/:branch_id')
  findByBranch(@Param('branch_id', ParseIntPipe) branchId: number) {
    return this.genre.findMany(branchId);
  }

  // --------------Các endpoint dưới đây sẽ được bảo vệ bởi quyền truy cập----------------

  @Post()
  create(@UserCtx() user: User, @Body() dto: CreateGenreDto) {
    return this.genre.create(user.branchId, dto);
  }

  @Get()
  findMany(@UserCtx() user: User) {
    return this.genre.findMany(user.branchId);
  }

  @Get(':id')
  find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.genre.find(user.branchId, id);
  }

  @Patch(':id')
  update(
    @UserCtx() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGenreDto,
  ) {
    return this.genre.update(user.branchId, id, dto);
  }

  @Delete('batch')
  deleteBatch(
    @UserCtx() user: User,
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
      }),
    )
    ids: number[],
  ) {
    return this.genre.deleteBatch(user.branchId, ids);
  }

  @Delete(':id')
  delete(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.genre.delete(user.branchId, id);
  }
}
