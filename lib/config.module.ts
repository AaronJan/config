import { DynamicModule, Module } from '@nestjs/common';
import { FactoryProvider, Provider } from '@nestjs/common/interfaces';
import { isObject } from 'util';
import { ConfigHostModule } from './config-host.module';
import {
  VALIDATED_CONFIGURATION_KEY,
  CONFIGURATION_TOKEN,
  CONFIGURATION_LOADER,
  CONFIGURATION_SERVICE_TOKEN,
  CONFIGURATION_CONTENT_INITIALIZATION,
  VALIDATED_CONFIGURATION_TOKEN,
} from './config.constants';
import { ConfigService } from './config.service';
import { ConfigFactory, ConfigModuleOptions } from './interfaces';
import { ConfigFactoryKeyHost } from './utils';
import { createConfigProvider } from './utils/create-config-factory.util';
import { getRegistrationToken } from './utils/get-registration-token.util';
import { loadEnvFile, loadJsonFile } from './utils/file-loaders.util';
import { mergeConfigObject } from './utils/merge-configs.util';

@Module({
  imports: [ConfigHostModule],
  providers: [
    {
      provide: ConfigService,
      useExisting: CONFIGURATION_SERVICE_TOKEN,
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {
  /**
   * Loads process environment variables depending on the "ignoreEnvFile" flag and "envFilePath" value.
   * Also, registers custom configurations globally.
   * @param options
   */
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    const isConfigToLoad =
      options.load !== undefined && options.load.length > 0;

    const providers = (options.load || [])
      .map(factory =>
        createConfigProvider(factory as ConfigFactory & ConfigFactoryKeyHost),
      )
      .filter(item => item) as FactoryProvider[];
    const configProviderTokens = providers.map(item => item.provide);

    const essentialProviders: Provider<any>[] = [
      ...providers,
      {
        provide: ConfigService,
        useFactory: (configService: ConfigService) => configService,
        inject: [CONFIGURATION_SERVICE_TOKEN, ...configProviderTokens],
      },
      {
        // Inject configuration content into host.
        provide: CONFIGURATION_CONTENT_INITIALIZATION,
        useFactory: async (configHost: Record<string, any>) => {
          let config = await this.loadFile(options);

          if (options.validationSchema) {
            const validationOptions = this.getSchemaValidationOptions(options);
            const {
              error,
              value: validatedConfig,
            } = options.validationSchema.validate(config, validationOptions);

            if (error) {
              throw new Error(`Config validation error: ${error.message}`);
            }
            config = validatedConfig;
          }

          if (options.type === 'env') {
            this.assignVariablesToProcess(config);
          }

          configHost[VALIDATED_CONFIGURATION_KEY] = config;
        },
        inject: [CONFIGURATION_TOKEN],
      },
      {
        provide: VALIDATED_CONFIGURATION_TOKEN,
        useFactory: (configHost: Record<string, any>) => {
          return configHost[VALIDATED_CONFIGURATION_KEY];
        },
        inject: [CONFIGURATION_TOKEN, CONFIGURATION_CONTENT_INITIALIZATION],
      },
    ];

    return {
      module: ConfigModule,
      global: options.isGlobal,
      providers: isConfigToLoad
        ? [
            ...essentialProviders,
            {
              provide: CONFIGURATION_LOADER,
              useFactory: (
                host: Record<string, any>,
                ...configurations: Record<string, any>[]
              ) => {
                configurations.forEach((item, index) =>
                  this.mergePartial(host, item, providers[index]),
                );
              },
              inject: [CONFIGURATION_TOKEN, ...configProviderTokens],
            },
          ]
        : essentialProviders,
      exports: [
        ConfigService,
        VALIDATED_CONFIGURATION_TOKEN,
        ...configProviderTokens,
      ],
    };
  }

  private static async loadFile(
    options: ConfigModuleOptions,
  ): Promise<Record<string, any>> {
    switch (options.type) {
      case 'env':
        return await loadEnvFile(options.envFile);
      case 'json':
        return await loadJsonFile(options.jsonFile);
      case 'custom':
        return await options.configLoader();
      default:
        throw new Error(`Incorrect configure type: ${(options as any).type}`);
    }
  }

  /**
   * Registers configuration object (partial registration).
   * @param config
   */
  static forFeature(config: ConfigFactory): DynamicModule {
    const configProvider = createConfigProvider(
      config as ConfigFactory & ConfigFactoryKeyHost,
    );
    const serviceProvider = {
      provide: ConfigService,
      useFactory: (configService: ConfigService) => configService,
      inject: [CONFIGURATION_SERVICE_TOKEN, configProvider.provide],
    };

    return {
      module: ConfigModule,
      providers: [
        configProvider,
        serviceProvider,
        {
          provide: CONFIGURATION_LOADER,
          useFactory: (
            host: Record<string, any>,
            partialConfig: Record<string, any>,
          ) => {
            this.mergePartial(host, partialConfig, configProvider);
          },
          inject: [CONFIGURATION_TOKEN, configProvider.provide],
        },
      ],
      exports: [ConfigService, configProvider.provide],
    };
  }

  private static assignVariablesToProcess(config: Record<string, any>) {
    if (!isObject(config)) {
      return;
    }
    const keys = Object.keys(config).filter(key => !(key in process.env));
    keys.forEach(key => (process.env[key] = config[key]));
  }

  private static mergePartial(
    host: Record<string, any>,
    item: Record<string, any>,
    provider: FactoryProvider,
  ) {
    const factoryRef = provider.useFactory;
    const token = getRegistrationToken(factoryRef);

    mergeConfigObject(host, item, token);
  }

  private static getSchemaValidationOptions(options: ConfigModuleOptions) {
    if (options.validationOptions) {
      if (typeof options.validationOptions.allowUnknown === 'undefined') {
        options.validationOptions.allowUnknown = true;
      }
      return options.validationOptions;
    }
    return {
      abortEarly: false,
      allowUnknown: true,
    };
  }
}
