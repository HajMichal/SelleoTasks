import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: User) {
    const isUserExists = await this.findOne(data.email);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    if (isUserExists) throw new ConflictException();
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
  async getAllUsers() {
    return this.prisma.user.findMany();
  }
  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email },
    });
  }
}
