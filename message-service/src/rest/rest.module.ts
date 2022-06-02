import { FeedbackModule } from 'src/feedback/feedback.module';
import { Link } from 'src/entities/link.entity';
import { Message } from 'src/entities/messages.entity';
import { Module } from '@nestjs/common';
import { RestController } from './rest.controller';
import { RestService } from './rest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'config.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Link, Message]),
    FeedbackModule,
  ],
  controllers: [RestController],
  providers: [RestService],
})
export class RestModule {}
