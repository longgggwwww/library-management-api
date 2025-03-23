import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';

@Module({
    imports: [
        // CustomPrismaModule.forRootAsync({
        //     name: 'PrismaWithExtension',
        //     useFactory: () => {
        //         return extendedPrismaClient;
        //     },
        // }),
    ],
    controllers: [PublicationController],
    providers: [PublicationService, PrismaService],
})
export class PublicationModule {}
