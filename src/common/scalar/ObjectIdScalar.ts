import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { Types } from 'mongoose';

@Scalar('ObjectId')
export class ObjectIdScalar implements CustomScalar<string, Types.ObjectId> {
  description = 'Mongo object id scalar type';

  parseValue(value: string): Types.ObjectId {
    return new Types.ObjectId(value); // value from the client
  }

  serialize(value: Types.ObjectId): string {
    return value.toString(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Types.ObjectId {
    if (ast.kind === Kind.STRING) {
      return new Types.ObjectId(ast.value); // value from the client query
    }
    return null;
  }
}
