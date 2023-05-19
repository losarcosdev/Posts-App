import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginEmailDto, SignInDto } from './dto';
import { User } from '../user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Creates a new user in the database with the provided user data.
   * @param signInDto - an object containing the user data to create a new user
   * @returns the new user object, including a JSON web token
   */
  async signIn(signInDto: SignInDto) {
    try {
      const { password, ...userData } = signInDto;

      // Create a new user object with the provided user data, and hash the password
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 12),
      });

      // Save the new user to the database
      await this.userRepository.save(user);

      delete user.resetPasswordToken;
      delete user.password;
      delete user.roles;
      user.posts = [] as any;
      user.comments = [];

      // Return the new user object, including a JSON web token
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  /**
   * Attempts to log in a user with the provided email and password.
   * @param loginEmailDto - an object containing the email and password for the user attempting to log in
   * @returns the user object, including a JSON web token
   */
  async login(loginEmailDto: LoginEmailDto) {
    const { email, password } = loginEmailDto;

    try {
      // Find a user with a matching email in the database
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.posts', 'userPosts')
        .leftJoinAndSelect('user.comments', 'userComments')
        .where({ email })
        .getOne();

      // If no user is found, throw an UnauthorizedException
      if (!user) {
        throw new UnauthorizedException(
          'Not found user with those credentials',
        );
      }

      // Compare the provided password with the hashed password in the database using bcrypt
      if (!bcrypt.compareSync(password, user.password)) {
        // If the passwords don't match, throw an UnauthorizedException
        throw new UnauthorizedException(
          'Not found user with those credentials',
        );
      }

      delete user.password;
      delete user.roles;
      delete user.resetPasswordToken;
      delete user.likes;
      delete user.comments;
      delete user.posts;

      // Return the user if the email and password are correct
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Unexpected error: ${error}`);
    throw new InternalServerErrorException('Server error - check logs');
  }
}
