import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RestAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return Boolean(request['user']);
  }
}
