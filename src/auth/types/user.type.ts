// Định nghĩa kiểu dữ liệu của user
export type User = {
  id: number; // ID của user
  branchId: number; // ID của branch mà user đó thuộc về
  permissions: string[]; // Mã quyền của user
};
