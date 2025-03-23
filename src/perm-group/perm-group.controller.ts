import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PublicEndpoint } from 'src/auth/decorators/public-endpoint.decorator';
import { PermGroupService } from './perm-group.service';

@PublicEndpoint()
@Controller('perm-groups')
export class PermGroupController {
    constructor(private readonly permGroup: PermGroupService) {}

    // Endpoint để lấy danh sách nhóm quyền
    @Get()
    findMany() {
        console.log('go here');
        return this.permGroup.findMany();
    }

    // Endpoint để lấy một nhóm quyền
    @Get(':id')
    find(@Param('id', ParseIntPipe) id: number) {
        return this.permGroup.find(id);
    }
}
