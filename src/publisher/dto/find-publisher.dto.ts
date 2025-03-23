import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';

export class FindPublisherDto {
    @IsInt()
    @IsOptional()
    id?: number;

    @IsInt()
    @IsOptional()
    take?: number;

    @IsInt()
    @IsOptional()
    skip?: number;

    @IsEnum(Prisma.SortOrder)
    @IsOptional()
    order?: 'asc' | 'desc' = 'asc';

    @IsIn(Object.keys(Prisma.PublisherScalarFieldEnum))
    @IsOptional()
    field?: Prisma.PublisherScalarFieldEnum =
        Prisma.PublisherScalarFieldEnum.name;
}
