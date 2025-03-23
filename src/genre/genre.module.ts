import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

@Module({
    controllers: [GenreController],
    providers: [GenreService, PrismaService],
})
export class GenreModule {}
