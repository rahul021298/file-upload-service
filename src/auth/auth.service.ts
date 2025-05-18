import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto): Promise<{ access_token: string }> {
    let user = await this.usersService.findByEmail(authDto.email);

    if (!user) {
      const hashedPassword = await bcrypt.hash(authDto.password, 10);
      user = await this.usersService.create({
        email: authDto.email,
        password: hashedPassword,
      });
    }

    if (!(await bcrypt.compare(authDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
