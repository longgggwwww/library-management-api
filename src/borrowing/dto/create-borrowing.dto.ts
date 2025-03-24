export class CreateBorrowingDto {
  code: string;

  memberId: number;

  borrowingDate: Date;

  returnDate: Date;

  status: string;

  note: string;

  items: number[];
}
