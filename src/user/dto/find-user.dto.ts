import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';

export class FindUserDto {
    @IsInt()
    @IsOptional()
    id?: number;

    @IsInt()
    @IsOptional()
    take?: number;

    @IsInt()
    @IsOptional()
    skip?: number;

    @IsOptional()
    @IsEnum(Prisma.SortOrder)
    order?: Prisma.SortOrder = Prisma.SortOrder.asc;

    @IsOptional()
    @IsIn(Object.keys(Prisma.UserScalarFieldEnum))
    field?: Prisma.UserScalarFieldEnum = Prisma.UserScalarFieldEnum.username;
}
