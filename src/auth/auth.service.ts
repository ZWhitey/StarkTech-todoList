import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findOne(username);
    if (!(await bcrypt.compare(pass, user?.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(username: string, pass: string) {
    if (!username || !pass) {
      throw new BadRequestException('Invalid username or password');
    }
    const hashPass = await bcrypt.hash(pass, 1);
    const user = await this.usersService.create(username, hashPass);
    if (!user) {
      throw new ConflictException('User already exists');
    }
    const payload = { sub: user._id, username: username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
