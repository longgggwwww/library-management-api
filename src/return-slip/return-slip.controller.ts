import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateReturnSlipDto } from './dto/create-return-slip.dto';
import { UpdateReturnSlipDto } from './dto/update-return-slip.dto';
import { ReturnSlipService } from './return-slip.service';

@Controller('return-slips')
export class ReturnSlipController {
  constructor(private readonly returnSlip: ReturnSlipService) {}

  @Post()
  create(@Body() createReturnSlipDto: CreateReturnSlipDto) {
    return this.returnSlip.create(createReturnSlipDto);
  }

  @Get()
  findAll() {
    return this.returnSlip.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returnSlip.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReturnSlipDto: UpdateReturnSlipDto,
  ) {
    return this.returnSlip.update(+id, updateReturnSlipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.returnSlip.remove(+id);
  }
}
