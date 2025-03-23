import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ACCESS = 'isPublic';
export const PublicEndpoint = () => SetMetadata(IS_PUBLIC_ACCESS, true);
