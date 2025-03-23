import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';

@Module({
    controllers: [LanguageController],
    providers: [LanguageService, PrismaService],
})
export class LanguageModule {}
