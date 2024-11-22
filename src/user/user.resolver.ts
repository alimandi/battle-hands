import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }
}
