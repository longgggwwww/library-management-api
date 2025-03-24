import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';

@Module({
  controllers: [HashtagController],
  providers: [HashtagService, PrismaService],
})
export class HashtagModule {}
