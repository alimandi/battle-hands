import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import { JwtService } from 'src/jwt/jwt.service';
import { User, UserDocument } from 'src/user/schema/user.schema';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dto/change-password.dto';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
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
import { PasswordCheckService } from './password-check.service';
import { SignUpOutput, SingUpInput } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly passwordCheckService: PasswordCheckService,
  ) {}

  async signUp(
    singUpInput: SingUpInput,
    userAgent?: string,
  ): Promise<SignUpOutput> {
    const { email, password, fullname, clientType } = singUpInput;

    const existingUser = await this.model.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = new this.model({
      email,
      fullname,
      password,
    });

    try {
      await user.save();

      user.loginHistory = [];

      user.loginHistory.push({
        user_agent: userAgent,
        date: new Date(),
      });

      console.log('dsklndsflkn');

      const token = this.jwtService.sign(user.id);

      const decodedToken = jwt.decode(token.token) as { exp: number };

      const decodedRefreshToken = jwt.decode(token.refreshToken) as {
        exp: number;
      };
      console.log('dsklndsflkn');

      const expirationToken = new Date(decodedToken.exp * 1000);

      const expirationRefreshToken = new Date(decodedRefreshToken.exp * 1000);

      this.jwtService.saveToken(
        token,
        user.id,
        clientType,
        userAgent,
        expirationToken,
        expirationRefreshToken,
      );

      return { ...token, user, expirationRefreshToken, expirationToken };
    } catch (error) {
      throw new InternalServerErrorException('Error during user registration');
    }
  }

  async login(input: LoginInput, userAgent?: string): Promise<LoginOutput> {
    const { email, password, clientType } = input;

    const users = await this.model.find();

    // checking if user available
    const user = await this.model.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.loginHistory) user.loginHistory = [];

    user.loginHistory.push({
      user_agent: userAgent,
      date: new Date(),
    });

    await user.save();

    // checking if password is correct
    const passwordCorrect = await user.checkPassword(password);
    if (!passwordCorrect) {
      throw new UnauthorizedException('Wrong password');
    }

    // generate tokens and save them
    const token = this.jwtService.sign(user.id);

    const decodedToken = jwt.decode(token.token) as { exp: number };

    const decodedRefreshToken = jwt.decode(token.refreshToken) as {
      exp: number;
    };

    const expirationToken = new Date(decodedToken.exp * 1000);

    const expirationRefreshToken = new Date(decodedRefreshToken.exp * 1000);

    this.jwtService.saveToken(
      token,
      user.id,
      clientType,
      userAgent,
      expirationToken,
      expirationRefreshToken,
    );

    return { ...token, user, expirationRefreshToken, expirationToken };
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenInput): Promise<RefreshTokenOutput> {
    const decoded = this.jwtService.verify(refreshToken);

    if (typeof decoded === 'object' && decoded.hasOwnProperty('refreshId')) {
      const userId = decoded['refreshId'];
      const hasToken = await this.jwtService.hasRefreshToken(
        refreshToken.toString(),
        userId,
      );
      if (!hasToken) {
        throw new UnauthorizedException('Token is expired.');
      }

      const token = this.jwtService.sign(decoded['refreshId']);

      const decodedToken = jwt.decode(token.token) as { exp: number };

      const decodedRefreshToken = jwt.decode(token.refreshToken) as {
        exp: number;
      };

      const expirationToken = new Date(decodedToken.exp * 1000);

      const expirationRefreshToken = new Date(decodedRefreshToken.exp * 1000);

      await this.jwtService.updateByRefreshToken(userId, refreshToken, token);

      return { ...token, expirationRefreshToken, expirationToken };
    }

    throw new BadRequestException('Token is not valid');
  }

  async logout(input: LogoutInput): Promise<LogoutOutput> {
    const isDeleted = await this.jwtService.revoke(input.userId, input.token);
    if (!isDeleted) {
      throw new NotFoundException('Can not find any token to delete.');
    }
    return { success: true };
  }

  async requestResetPassword(
    requestResetPasswordInput: RequestResetPasswordInput,
  ): Promise<RequestResetPasswordOutput> {
    const { email } = requestResetPasswordInput;

    const user = await this.model.findOne({ email: email.toLowerCase() });

    if (!user) throw new NotFoundException('Your email not found.');

    const token = await jwt.sign(
      { userId: user._id },
      this.configService.get<string>('privateKey'),
      {
        expiresIn: `${this.configService.get<number>(
          'resetPasswordTokenExpirationMinute',
        )}m`,
      },
    );

    user.resetPasswordToken = token;
    await user.save();

    const redirectUrl = this.configService.get<string>(
      'resetPasswordRedirectUri',
    );

    await this.mailerService.sendMail({
      transporterName: 'qtical',
      from: '"Qtical" <no-reply@qtical.com>',
      to: email,
      subject: 'Password reset request',
      template: 'reset-password',
      context: {
        name: user.fullname,
        url: `${redirectUrl}?token=${token}`,
      },
    });

    return {
      message: 'email sent successfully',
    };
  }

  async me(context: any, _id: Types.ObjectId): Promise<MeOutput> {
    const user = await this.model.findByIdAndUpdate(
      _id,
      {
        lastActivity: {
          user_agent: context.req.headers['user-agent'],
          date: new Date(),
        },
      },
      { new: true },
    );

    if (!user) throw new NotFoundException();

    return { user };
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<ResetPasswordOutput> {
    const { token, password } = resetPasswordInput;

    let payload: any;

    try {
      payload = jwt.verify(token, this.configService.get<string>('privateKey'));
    } catch (err) {
      throw new UnauthorizedException('Wrong token.');
    }

    const user = await this.model.findById(payload.userId);

    if (!user) throw new NotFoundException();

    if (user.resetPasswordToken !== token) {
      throw new BadRequestException('Token mismatch.');
    }

    if (!this.passwordCheckService.isPasswordOk(password)) {
      throw new BadRequestException('Required password is weak.');
    }

    user.password = password;
    user.resetPasswordToken = null;

    await user.save();

    return {
      message: 'password changed successfully',
    };
  }

  async changePassword(
    data: ChangePasswordInput,
    loggedInUser: User,
  ): Promise<ChangePasswordOutput> {
    const isPasswordOk = this.passwordCheckService.isPasswordOk(data.password);
    if (!isPasswordOk) {
      throw new BadRequestException('Required password is weak.');
    }

    const user = await this.model.findById(loggedInUser._id.toString());

    // checking if password is correct
    const passwordCorrect = await user.checkPassword(data.currentPassword);
    if (!passwordCorrect) {
      throw new UnauthorizedException('Wrong password.');
    }

    if (!user) {
      throw new NotFoundException('User is not exists.');
    }
    user.password = data.password;
    await user.save();

    return { message: 'The password changed successfully.' };
  }

  async editProfile(
    input: EditProfileInput,
    loggedInUser: User,
  ): Promise<EditProfileOutput> {
    const { region, phone, ...rest } = input;

    const user = await this.model.findOneAndUpdate(
      { _id: loggedInUser._id },
      {
        ...rest,
      },
      { new: true },
    );

    if (!user) throw new NotFoundException('user not found');

    return {
      message: 'Edit user was successful',
      user,
    };
  }
}
