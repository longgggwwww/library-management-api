import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationRequestDto } from './create-publication-request.dto';

export class UpdatePublicationRequestDto extends PartialType(CreatePublicationRequestDto) {}
