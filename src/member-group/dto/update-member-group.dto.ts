import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberGroupDto } from './create-member-group.dto';

export class UpdateMemberGroupDto extends PartialType(CreateMemberGroupDto) {}
