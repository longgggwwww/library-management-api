import { IsInt } from 'class-validator';

// Gán role cho user
export class AssignRoleDto {
  @IsInt()
  roleId: number;
}
