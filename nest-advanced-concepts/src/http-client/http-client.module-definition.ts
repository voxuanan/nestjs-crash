import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: HTTP_MODULE_OPTIONS,
  OPTIONS_TYPE, // có viết thêm 2 hàm register và registerAsync trong module
  ASYNC_OPTIONS_TYPE, // có viết thêm 2 hàm register và registerAsync trong module
} = new ConfigurableModuleBuilder<{
  baseUrl?: string;
}>({ alwaysTransient: true }) // dùng để tạo nhiểu instance có cùng config
  //   .setClassMethodName('forRoot')
  //   .setFactoryMethodName('resolve')
  .setExtras<{ isGlobal?: boolean }>( // optional param for extras
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
