import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePublicationRequestDto } from './dto/create-publication-request.dto';
import { UpdatePublicationRequestDto } from './dto/update-publication-request.dto';
import { PublicationRequestService } from './publication-request.service';

@Controller('publication-requests')
export class PublicationRequestController {
  constructor(private readonly request: PublicationRequestService) {}

  @Post()
  create(@Body() createPublicationRequestDto: CreatePublicationRequestDto) {}

  @Get()
  findAll() {
    return this.request.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.request.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicationRequestDto: UpdatePublicationRequestDto,
  ) {
    return this.request.update(+id, updatePublicationRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.request.remove(+id);
  }
}
