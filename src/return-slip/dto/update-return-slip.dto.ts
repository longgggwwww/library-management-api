import { PartialType } from '@nestjs/mapped-types';
import { CreateReturnSlipDto } from './create-return-slip.dto';

export class UpdateReturnSlipDto extends PartialType(CreateReturnSlipDto) {}
