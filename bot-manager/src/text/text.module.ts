import { FeedbackScene } from 'src/scenes/feedback.scene';
import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextUpdate } from './text.update';

@Module({
  providers: [FeedbackScene, TextUpdate, TextService],
})
export class TextModule {}
