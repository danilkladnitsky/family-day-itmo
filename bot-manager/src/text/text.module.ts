import { AskScene } from 'src/scenes/ask.scene';
import { FeedbackScene } from 'src/scenes/feedback.scene';
import { FormScene } from 'src/scenes/form.scene';
import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextUpdate } from './text.update';

@Module({
  providers: [AskScene, FormScene, FeedbackScene, TextUpdate, TextService],
})
export class TextModule {}
