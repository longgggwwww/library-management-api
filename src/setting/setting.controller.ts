import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingService } from './setting.service';

@Controller('settings')
export class SettingController {
    constructor(private readonly setting: SettingService) {}

    // Endpoint này sẽ trả về tất cả các cài đặt
    @Get()
    find() {
        return this.setting.find();
    }

    // Endpoint này sẽ cập nhật cài đặt
    @Patch()
    update(@Body() dto: UpdateSettingDto) {
        return this.setting.update(dto);
    }
}
