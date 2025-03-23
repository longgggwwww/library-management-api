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
    UseGuards,
} from '@nestjs/common';
import { UserCtx } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/types/user.type';
import { BranchAccessGuard } from 'src/branch/branch-access.guard';
import { PublicBranch } from 'src/branch/decorators/public-branch.decorator';
import { CreateItemDto } from './dto/create-item.dto';
import { FindItemDto } from './dto/find-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemService } from './item.service';

@UseGuards(BranchAccessGuard)
@Controller('items')
export class ItemController {
    constructor(private readonly item: ItemService) {}

    @PublicBranch()
    @Get('branch/:branch_id')
    findByBranch(
        @Param('branch_id', ParseIntPipe) branchId: number,
        @Query() dto: FindItemDto,
    ) {
        return this.item.findMany(branchId, dto);
    }

    @Post()
    create(@UserCtx() user: User, @Body() dto: CreateItemDto) {
        if (!user.branchId) {
            throw new BadRequestException('Branch ID is required');
        }
        return this.item.create(user.id, user.branchId, dto);
    }

    @Get()
    findMany(@UserCtx() user: User, @Query() dto: FindItemDto) {
        if (!user.branchId) {
            throw new BadRequestException('Branch ID is required');
        }
        return this.item.findMany(user.branchId, dto);
    }

    @Get(':id')
    find(@UserCtx() user: User, @Param('id', ParseIntPipe) id: number) {
        if (!user.branchId) {
            throw new BadRequestException('Branch ID is required');
        }
        return this.item.find(user.branchId, id);
    }

    @Patch(':id')
    update(
        @UserCtx() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateItemDto,
    ) {
        if (!user.branchId) {
            throw new BadRequestException('Branch ID is required');
        }
        return this.item.update(user.branchId, id, dto);
    }
}
