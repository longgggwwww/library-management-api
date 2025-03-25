import { PartialType } from '@nestjs/mapped-types';
import { CreateMembershipGroupDto } from './create-membership-group.dto';

export class UpdateMemberGroupDto extends PartialType(
  CreateMembershipGroupDto,
) {}
