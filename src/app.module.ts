import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomPrismaModule, PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TokenAuthGuard } from './auth/jwt-auth.guard';
import { AuthorModule } from './author/author.module';
import { BorrowingFeePolicyModule } from './borrowing-fee-policy/borrowing-fee-policy.module';
import { BorrowingPolicyModule } from './borrowing-policy/borrowing-policy.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { BranchModule } from './branch/branch.module';
import { CategoryModule } from './category/category.module';
import { ClassModule } from './class/class.module';
import { throttle } from './common/constants/env-keys';
import { CUSTOM_PRISMA_CLIENT } from './common/constants/inject-tokens';
import { ApiKeyAuthGuard } from './common/guards/api-key-auth.guard';
import { ExtendedPrismaConfigService } from './custom-prisma/custom-prisma.service';
import { GenreModule } from './genre/genre.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { InventoryModule } from './inventory/inventory.module';
import { ItemModule } from './item/item.module';
import { LanguageModule } from './language/language.module';
import { MemberModule } from './member/member.module';
import { MembershipGroupModule } from './membership-group/membership-group.module';
import { MembershipPlanModule } from './membership-plan/membership-plan.module';
import { PermGroupModule } from './perm-group/perm-group.module';
import { AuthorizationGuard } from './permission/permission.guard';
import { PermModule } from './permission/permission.module';
import { PublicationRequestModule } from './publication-request/publication-request.module';
import { PublicationModule } from './publication/publication.module';
import { PublisherModule } from './publisher/publisher.module';
import { RackModule } from './rack/rack.module';
import { ReturnSlipModule } from './return-slip/return-slip.module';
import { RoleModule } from './role/role.module';
import { SchoolYearModule } from './school-year/school-year.module';
import { SettingModule } from './setting/setting.module';
import { ShelfModule } from './shelf/shelf.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Thêm module Throttler để hạn chế số lượng request
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: throttle.ttl,
          limit: throttle.limit,
        },
      ],
    }),
    CustomPrismaModule.forRootAsync({
      name: CUSTOM_PRISMA_CLIENT,
      useClass: ExtendedPrismaConfigService,
    }),
    PrismaModule,
    AuthModule,
    RoleModule,
    PermModule,
    UserModule,
    BranchModule,
    SettingModule,
    CategoryModule,
    PublicationModule,
    PublisherModule,
    LanguageModule,
    AuthorModule,
    GenreModule,
    HashtagModule,
    ItemModule,
    InventoryModule,
    ClassModule,
    SchoolYearModule,
    MemberModule,
    MembershipGroupModule,
    MembershipPlanModule,
    BorrowingModule,
    PermGroupModule,
    CustomPrismaModule,
    BorrowingFeePolicyModule,
    BorrowingPolicyModule,
    ShelfModule,
    RackModule,
    PublicationRequestModule,
    ReturnSlipModule,
  ],
  controllers: [AppController],
  providers: [
    // Áp dụng các guard toàn cục để bảo mật API
    { provide: APP_GUARD, useClass: ApiKeyAuthGuard },
    { provide: APP_GUARD, useClass: TokenAuthGuard },
    { provide: APP_GUARD, useClass: AuthorizationGuard },
    AppService,
  ],
})
export class AppModule {}
