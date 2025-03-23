import { PartialType } from '@nestjs/mapped-types';
import { CreatePermGroupDto } from './create-perm-group.dto';

export class UpdatePermGroupDto extends PartialType(CreatePermGroupDto) {}
