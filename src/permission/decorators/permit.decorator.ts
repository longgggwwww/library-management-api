import { SetMetadata } from '@nestjs/common';
import { Permissions } from 'src/permission/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
// Tạo decorator để kiểm tra quyền truy cập,
// decorator này sẽ được sử dụng ở các controller để kiểm tra quyền truy cập
// Ví dụ: @Permit('CREATE_PERMISSION', 'VIEW_PERMISSION')
// sẽ kiểm tra xem người dùng có quyền 'CREATE_PERMISSION' hoặc 'VIEW_PERMISSION' không để truy cập vào endpoint
export const Permit = (
  ...p: (keyof typeof Permissions)[] // Lấy danh sách quyền truy cập
) => SetMetadata(PERMISSIONS_KEY, p);
