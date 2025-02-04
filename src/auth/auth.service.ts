import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from 'src/user/user.schema';

import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup({ email, password }: AuthDto) {
    try {
      // Check if the user already exists
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('Email is already in use.');
      }

      // Hash the password
      const hash = await argon.hash(password);

      // Save the new user
      const user = await new this.userModel({ email, hash }).save();

      const userObject = user.toObject();

      return this.generateToken(userObject._id, userObject.email);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      // Handle validation or database errors
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid user data.');
      }

      // Handle unexpected errors
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async signin({ email, password }: AuthDto) {
    try {
      // Find user by email
      const user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      // Verify the password
      const isPasswordValid = await argon.verify(user.hash, password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const userObject = user.toObject();

      return this.generateToken(userObject._id, userObject.email);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Handle unexpected errors
      throw new UnauthorizedException('Authentication failed.');
    }
  }

  generateToken(id: unknown, email: string) {
    const payload = { sub: id, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      accessToken,
    };
  }
}
