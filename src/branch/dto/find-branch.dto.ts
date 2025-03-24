import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';

export class FindBranchDto {
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
  @IsIn(Object.keys(Prisma.BranchScalarFieldEnum))
  field?: Prisma.BranchScalarFieldEnum = Prisma.BranchScalarFieldEnum.name;
}
