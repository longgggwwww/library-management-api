import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomPrismaModule, PrismaModule } from 'nestjs-prisma';
import { AccountPackageModule } from './account-package/account-package.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TokenAuthGuard } from './auth/jwt-auth.guard';
import { AuthorModule } from './author/author.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { BranchModule } from './branch/branch.module';
import { CategoryModule } from './category/category.module';
import { ClassModule } from './class/class.module';
import { throttleLimit, throttleTTL } from './common/constants/env-keys';
import { CUSTOM_PRISMA_CLIENT } from './common/constants/inject-tokens';
import { ApiKeyAuthGuard } from './common/guards/api-key-auth.guard';
import { ExtendedPrismaConfigService } from './custom-prisma/custom-prisma.service';
import { GenreModule } from './genre/genre.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { InventoryModule } from './inventory/inventory.module';
import { ItemModule } from './item/item.module';
import { LanguageModule } from './language/language.module';
import { MemberGroupModule } from './member-group/member-group.module';
import { MemberModule } from './member/member.module';
import { PermGroupModule } from './perm-group/perm-group.module';
import { AuthorizationGuard } from './permission/permission.guard';
import { PermModule } from './permission/permission.module';
import { PublicationModule } from './publication/publication.module';
import { PublisherModule } from './publisher/publisher.module';
import { RoleModule } from './role/role.module';
import { SchoolYearModule } from './school-year/school-year.module';
import { SettingModule } from './setting/setting.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        // Thêm module Throttler để hạn chế số lượng request
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: throttleTTL,
                    limit: throttleLimit,
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
        MemberGroupModule,
        AccountPackageModule,
        BorrowingModule,
        PermGroupModule,
        CustomPrismaModule,
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
