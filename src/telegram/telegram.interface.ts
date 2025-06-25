import { ModuleMetadata } from '@nestjs/common';

export interface ITelegramOptional {
  chatId: string;
  token: string;
}
export interface ITelegramModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<ITelegramOptional> | ITelegramOptional;
  inject?: any[];
}
