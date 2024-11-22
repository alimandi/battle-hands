import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_REST_KEY = 'permissions-rest';

export const PermissionsRest = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_REST_KEY, permissions);
