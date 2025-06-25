import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ITelegramOptional } from './telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constant';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: ITelegramOptional;

  constructor(@Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptional) {
    this.bot = new Telegraf(options.token);
    this.options = options;
  }
  async sendMessage(message: string, chatId: string = this.options.chatId) {
    await this.bot.telegram.sendMessage(chatId, message);
  }
}
