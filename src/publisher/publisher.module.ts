import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';

@Module({
    controllers: [PublisherController],
    providers: [PublisherService, PrismaService],
})
export class PublisherModule {}
