import { ConfigService } from '@nestjs/config';
import { ITelegramOptional } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (
  configService: ConfigService,
): ITelegramOptional => {
  const token: string | undefined = configService.get('TELEGRAM_TOKEN');
  if (!token) {
    throw new Error('TELEGRAM_TOKEN не задан');
  }
  return {
    token,
    chatId: configService.get('CHAT_ID') ?? '',
  };
};
