import { IsInt, IsString } from 'class-validator';

export class CreateHashtagDto {
    @IsString()
    name: string; // Tên của hashtag

    @IsInt()
    publicationId: number; // ID của ấn phẩm
}
