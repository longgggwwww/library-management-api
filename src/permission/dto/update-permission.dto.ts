import { PartialType } from '@nestjs/mapped-types';
import { CreatePermDto } from './create-permission.dto';

export class UpdatePermDto extends PartialType(CreatePermDto) {}
