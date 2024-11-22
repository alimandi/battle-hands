import {
  Args,
  Context,
  Info,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { ObjectIdScalar } from 'src/common/scalar/ObjectIdScalar';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/user/schema/user.schema';
import { AuthService } from './auth.service';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dto/change-password.dto';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { GetActiveTokensOutput } from './dto/get-active-tokens.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { LogoutInput, LogoutOutput } from './dto/logout.dto';
import { MeOutput } from './dto/me.dto';
import { RefreshTokenInput, RefreshTokenOutput } from './dto/refresh-token.dto';
import {
  RequestResetPasswordInput,
  RequestResetPasswordOutput,
} from './dto/request-reset-password.dto';
import {
  ResetPasswordInput,
  ResetPasswordOutput,
} from './dto/reset-password.dto';
import { Auth } from './guard/auth.decorator';
import { SignUpOutput, SingUpInput } from './dto/signup.dto';

@Resolver((of) => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Mutation((returns) => LoginOutput, { description: 'Login to battle-hands.' })
  async signUp(
    @Args('input') input: SingUpInput,
    @Context() context: any,
    @Info() info,
  ): Promise<SignUpOutput> {
    let keys = info.fieldNodes[0].selectionSet.selections.map(
      (item) => item.name.value,
    );
    return this.authService.signUp(input, context.req.headers['user-agent']);
  }

  @Mutation((returns) => LoginOutput, { description: 'Login to battle-hands.' })
  async login(
    @Args('input') input: LoginInput,
    @Context() context: any,
    @Info() info,
  ): Promise<LoginOutput> {
    let keys = info.fieldNodes[0].selectionSet.selections.map(
      (item) => item.name.value,
    );
    return this.authService.login(input, context.req.headers['user-agent']);
  }

  @Auth()
  @Mutation((returns) => LogoutOutput)
  async logout(@Args('input') input: LogoutInput): Promise<LogoutOutput> {
    return this.authService.logout(input);
  }

  @Auth()
  @Mutation((returns) => RefreshTokenOutput)
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<RefreshTokenOutput> {
    return this.authService.refreshToken(input);
  }

  @Auth()
  @Query((returns) => MeOutput)
  async me(
    @Context() context: any,
    @CurrentUser() user: User,
  ): Promise<MeOutput> {
    return this.authService.me(context, user._id);
  }

  @Mutation((returns) => RequestResetPasswordOutput)
  async requestResetPassword(
    @Args('input') input: RequestResetPasswordInput,
  ): Promise<RequestResetPasswordOutput> {
    return this.authService.requestResetPassword(input);
  }

  @Mutation((returns) => ResetPasswordOutput)
  async resetPassword(
    @Args('input') input: ResetPasswordInput,
  ): Promise<ResetPasswordOutput> {
    return this.authService.resetPassword(input);
  }

  @Auth()
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @Args('input') input: EditProfileInput,
    @CurrentUser() user: User,
  ): Promise<EditProfileOutput> {
    return this.authService.editProfile(input, user);
  }

  @Auth()
  @Mutation((returns) => ChangePasswordOutput)
  async changePassword(
    @Args('input') input: ChangePasswordInput,
    @CurrentUser() user: User,
  ): Promise<ChangePasswordOutput> {
    return this.authService.changePassword(input, user);
  }

  @Query((returns) => GetActiveTokensOutput)
  async getActiveTokens(
    @Args('_id', { type: () => ObjectIdScalar }) _id: Types.ObjectId,
  ): Promise<GetActiveTokensOutput> {
    return this.jwtService.getActiveTokens(_id);
  }
}
