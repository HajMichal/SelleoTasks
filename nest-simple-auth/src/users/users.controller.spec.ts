import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = new PrismaService();
    usersService = new UsersService(prisma);
    usersController = new UsersController(usersService);
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          id: 1,
          phoneNumber: 537886057,
          firstName: 'Michal',
          lastName: 'Haj',
          shirtSize: 'S',
          preferredTechnology: 'JavaScript',
          email: 'michalhaj.kontak,@gmail.com',
          password: 'qwerty',
        },
      ];
      jest
        .spyOn(usersService, 'getAllUsers')
        .mockImplementation(async () => result);

      expect(await usersController.getAllUsers()).toBe(result);
    });
  });

  describe('createUser', () => {
    const userData: User = {
      id: 1,
      phoneNumber: 537886057,
      firstName: 'Michal',
      lastName: 'Haj',
      shirtSize: 'S',
      preferredTechnology: 'JavaScript',
      email: 'michalhaj.kontak,@gmail.com',
      password: 'qwerty',
    };
    it('should create a new user', async () => {
      const salt = 'salt123';

      jest.spyOn(usersService, 'findOne').mockImplementation(null);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(userData.password);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(userData);

      const result = await usersService.createUser(userData);
      expect(result).toEqual(userData);
    });

    it('should throw ConflictException if user already exists', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(userData);

      await expect(usersService.createUser(userData)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
