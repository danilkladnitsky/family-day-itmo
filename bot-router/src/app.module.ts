import { Module } from '@nestjs/common';
import { RouterModule } from './routes/router.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'config.service';

@Module({
  imports: [
    RouterModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
  ],
})
export class AppModule {}
