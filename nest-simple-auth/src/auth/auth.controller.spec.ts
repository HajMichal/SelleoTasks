import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

describe('AuthController', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  const userData = {
    id: 1,
    phoneNumber: 537886057,
    firstName: 'Michal',
    lastName: 'Haj',
    shirtSize: 'S',
    preferredTechnology: 'JavaScript',
    email: 'michalhaj.kontak,@gmail.com',
    password: 'qwerty',
  };
  describe('signIn', () => {
    it('should sign in user and return access token', async () => {
      const token = 'mockedToken';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(userData);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service.signIn(userData.email, userData.password);
      expect(result.access_token).toEqual(token);
    });
  });
  it('should throw UnauthorizedException if password is incorrect', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(userData);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(
      service.signIn(userData.email, userData.password),
    ).rejects.toThrow(UnauthorizedException);
  });
});
