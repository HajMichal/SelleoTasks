import { Module } from '@nestjs/common';
import { FileModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), FileModule],
})
export class AppModule {}
