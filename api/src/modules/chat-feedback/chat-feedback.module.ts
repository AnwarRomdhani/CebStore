/**
 * Module ChatFeedback
 * @description Module de collecte de feedback pour l'amélioration du chatbot
 */

import { Module } from '@nestjs/common';
import { ChatFeedbackService } from './chat-feedback.service';
import { ChatFeedbackController } from './chat-feedback.controller';

@Module({
  controllers: [ChatFeedbackController],
  providers: [ChatFeedbackService],
  exports: [ChatFeedbackService],
})
export class ChatFeedbackModule {}
