import { applyDecorators, UseGuards } from '@nestjs/common';
import { RestAuthGuard } from './auth-rest.guard';

export function RestAuth() {
  return applyDecorators(UseGuards(RestAuthGuard));
}
