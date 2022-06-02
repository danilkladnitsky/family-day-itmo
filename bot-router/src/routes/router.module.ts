import { Module } from '@nestjs/common';
import { RouteEntity } from 'src/entities/route.entity';
import { RouterController } from './router.controller';
import { RouterService } from './router.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RouteEntity])],
  controllers: [RouterController],
  providers: [RouterService],
})
export class RouterModule {}
