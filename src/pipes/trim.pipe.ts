import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  // Kiểm tra xem giá trị có phải là một object hay không
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  // Hàm đệ quy để trim các chuỗi trong object, bỏ qua trường 'password'
  private trim(val: any) {
    Object.keys(val).forEach((key) => {
      if (key !== 'password') {
        // Không xử lý trường 'password'
        if (this.isObj(val[key])) {
          // Nếu giá trị là object, gọi đệ quy
          val[key] = this.trim(val[key]);
        } else {
          if (typeof val[key] === 'string') {
            // Nếu giá trị là chuỗi, trim khoảng trắng
            val[key] = val[key].trim();
          }
        }
      }
    });
    return val;
  }

  // Hàm transform xử lý dữ liệu đầu vào
  transform(vals: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body') {
      // Chỉ xử lý nếu type là 'body'
      if (this.isObj(vals)) {
        return this.trim(vals); // Trim dữ liệu nếu là object
      }
      throw new BadRequestException('Validation failed'); // Ném lỗi nếu không phải object
    }
    return vals; // Trả về dữ liệu không thay đổi nếu không phải 'body'
  }
}
