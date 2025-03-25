import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CustomPrismaService } from 'nestjs-prisma';
import { tokens } from 'src/common/constants/env-keys';
import { CUSTOM_PRISMA_CLIENT } from 'src/common/constants/inject-tokens';
import { ExtendedPrismaClient } from 'src/custom-prisma/custom-prisma.extension';
import { UserService } from 'src/user/user.service';
import { LoginAsMemberDto, RefreshTokenDto } from './dto/auth-token.dto';
import { User } from './types/user.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CUSTOM_PRISMA_CLIENT)
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
    private readonly user: UserService,
    private readonly jwt: JwtService,
  ) {}

  // Hàm xác thực người dùng bằng cách kiểm tra username và password
  async validate(username: string, password: string) {
    const user = await this.user.findUnique({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password); // So sánh password
      if (isMatch) {
        const { password: _, ...result } = user; // Loại bỏ password khỏi kết quả trả về
        return result;
      }
    }
    return null; // Trả về null nếu không hợp lệ
  }

  async login(payload: User) {
    const user = await this.user.find(payload.id);

    // Tạo access token chứa thông tin người dùng và quyền
    const accessToken = this.jwt.sign(<User>{
      id: user.id,
      branchId: user.branch?.id, // Lấy ID branch nếu có
      permissions: user.role?.permissions.map((perm) => perm.id) || [], // Lấy danh sách mã quyền
    });

    // Tạo refresh token với thời gian hết hạn
    const refreshToken = this.jwt.sign(
      { id: user.id },
      {
        secret: tokens.user.refreshToken.secret, // Sử dụng secret cho refresh token
        expiresIn: tokens.user.refreshToken.ttl, // Thời gian hết hạn
      },
    );

    return { accessToken, refreshToken, user };
  }

  // Hàm làm mới token
  async refresh(dto: RefreshTokenDto) {
    try {
      // Giải mã token để lấy thông tin người dùng
      const decoded = this.jwt.verify(dto.refreshToken, {
        secret: tokens.user.refreshToken.secret, // Sử dụng secret để giải mã
      });

      // Tìm người dùng theo ID từ token
      const user = await this.user.find(decoded.id);
      if (!user) {
        throw new BadRequestException('Invalid token'); // Báo lỗi nếu không tìm thấy người dùng
      }

      // Lấy danh sách mã quyền từ vai trò của người dùng
      const userPermissions =
        user.role?.permissions.map((perm) => perm.id) || [];

      // Tạo token mới và trả về
      return this.login({
        id: user.id,
        branchId: user.branch?.id,
        permissions: userPermissions,
      });
    } catch (err) {
      console.error(err); // Ghi log lỗi
      throw new BadRequestException('Invalid token'); // Báo lỗi nếu token không hợp lệ
    }
  }

  private memIncludeOpts: Prisma.MemberInclude = {
    branch: true,
    borrowedItems: {
      include: {
        publication: true,
      },
    },
    borrowingSlips: {
      include: {
        borrowings: {
          include: {
            item: {
              include: {
                publication: true,
              },
            },
          },
        },
        branch: true,
      },
    },
    class: true,
    memberGroup: true,
    schoolYear: true,
  };

  async loginAsMember(dto: LoginAsMemberDto) {
    const { method, username, password } = dto;

    // Tìm người dùng theo username hoặc email
    const user = await this.prisma.client.member.findFirst({
      where: {
        [method]: username,
      },
      include: this.memIncludeOpts,
    });
    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    // Kiểm tra trạn thái tài khoản
    if (user.isLocked) {
      throw new BadRequestException('Account is locked');
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid username or password');
    }

    // Tạo token và trả về
    return {
      accessToken: this.jwt.sign(
        {
          id: user.id,
          branchId: user.branchId,
          isLocked: user.isLocked,
        },
        {
          secret: tokens.member.accessToken.secret,
          expiresIn: tokens.member.accessToken.ttl,
        },
      ),
      refreshToken: this.jwt.sign(
        { id: user.id },
        {
          secret: tokens.member.refreshToken.secret,
          expiresIn: tokens.member.refreshToken.ttl,
        },
      ),
      user,
    };
  }

  async refreshTkAsMember(dto: RefreshTokenDto) {
    try {
      // Giải mã token để lấy thông tin người dùng
      const decoded = this.jwt.verify(dto.refreshToken, {
        secret: tokens.member.refreshToken.secret, // Sử dụng secret để giải mã
      });

      // Tìm người dùng theo ID từ token
      const user = await this.prisma.client.member.findFirst({
        where: {
          id: decoded.id,
        },
        include: this.memIncludeOpts,
      });
      if (!user) {
        throw new BadRequestException('Invalid token'); // Báo lỗi nếu không tìm thấy người dùng
      }

      // Tạo token mới và trả về
      return {
        accessToken: this.jwt.sign(
          {
            id: user.id,
            branchId: user.branchId,
            isLocked: user.isLocked,
          },
          {
            secret: tokens.member.accessToken.secret,
            expiresIn: tokens.member.accessToken.ttl,
          },
        ),
        refreshToken: this.jwt.sign(
          { id: user.id },
          {
            secret: tokens.member.refreshToken.secret,
            expiresIn: tokens.member.refreshToken.ttl,
          },
        ),
        user,
      };
    } catch (err) {
      console.error(err); // Ghi log lỗi
      throw new BadRequestException('Invalid token'); // Báo lỗi nếu token không hợp lệ
    }
  }
}
