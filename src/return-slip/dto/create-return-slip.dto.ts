export class CreateReturnSlipDto {
  code: string;
  borrowerId: number;
  returnDate: Date;
  note: string;
  borrowings: {
    borrowingId: number;
    returnedAt: Date;
  }[];
}
