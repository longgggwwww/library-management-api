import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SchoolYearController } from './school-year.controller';
import { SchoolYearService } from './school-year.service';

@Module({
    controllers: [SchoolYearController],
    providers: [SchoolYearService, PrismaService],
})
export class SchoolYearModule {}
