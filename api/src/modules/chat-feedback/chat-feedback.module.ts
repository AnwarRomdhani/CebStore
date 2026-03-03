import { Module } from '@nestjs/common';
import { ChatFeedbackService } from './chat-feedback.service';
import { ChatFeedbackController } from './chat-feedback.controller';

@Module({
  controllers: [ChatFeedbackController],
  providers: [ChatFeedbackService],
  exports: [ChatFeedbackService],
})
export class ChatFeedbackModule {}
