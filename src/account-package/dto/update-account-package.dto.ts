import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountPackageDto } from './create-account-package.dto';

export class UpdateAccountPackageDto extends PartialType(CreateAccountPackageDto) {}
