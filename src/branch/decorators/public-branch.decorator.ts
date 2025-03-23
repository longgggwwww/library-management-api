import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_BRANCH_KEY = 'isPublicBranch';
export const PublicBranch = () => SetMetadata(IS_PUBLIC_BRANCH_KEY, true);
