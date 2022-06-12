import { FeedbackModule } from 'src/feedback/feedback.module';
import { Link } from 'src/entities/link.entity';
import { Message } from 'src/entities/messages.entity';
import { Module } from '@nestjs/common';
import { RestController } from './rest.controller';
import { RestService } from './rest.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'config.service';
import { join } from 'path';

console.log(join(__dirname, '../../../photos'));

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Link, Message]),
    FeedbackModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../photos'),
      serveRoot: '/static/',
    }),
  ],
  controllers: [RestController],
  providers: [RestService],
})
export class RestModule {}
