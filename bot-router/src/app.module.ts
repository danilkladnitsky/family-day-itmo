import { Module } from '@nestjs/common';
import { RouterModule } from './routes/router.module';

@Module({
  imports: [RouterModule],
})
export class AppModule {}
