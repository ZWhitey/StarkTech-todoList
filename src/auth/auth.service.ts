import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(username: string, pass: string) {
    if (!username || !pass) {
      throw new BadRequestException('Invalid username or password');
    }
    const user = await this.usersService.create(username, pass);
    if (!user) {
      throw new ConflictException('User already exists');
    }
    const payload = { sub: user.userId, username: username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
