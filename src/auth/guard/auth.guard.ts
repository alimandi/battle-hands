import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext) {
    //Get graphql context.
    const gqlContext = GqlExecutionContext.create(context).getContext();

    //First get http request from context and check user property in it.
    //In the jwt middleware step, user property set in request object.
    const user = gqlContext.req['user'];

    //If user is not available, drop the access.
    if (!user) return false;

    gqlContext['user'] = user;
    return true;
  }
}
