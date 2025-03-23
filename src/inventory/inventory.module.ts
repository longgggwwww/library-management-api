import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
    controllers: [InventoryController],
    providers: [InventoryService, PrismaService],
})
export class InventoryModule {}
