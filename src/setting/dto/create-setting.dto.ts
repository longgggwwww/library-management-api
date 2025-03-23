import { IsInt } from 'class-validator';

export class CreateSettingDto {
    @IsInt()
    defaultRoleId: number; // Thêm trường defaultRoleId
}
