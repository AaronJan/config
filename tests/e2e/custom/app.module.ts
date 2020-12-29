import Joi from '@hapi/joi';
import { DynamicModule, Inject, Module, Optional } from '@nestjs/common';
import { join } from 'path';
import { ConfigType } from '../../../lib';
import { ConfigModule } from '../../../lib/config.module';
import { ConfigService } from '../../../lib/config.service';
import databaseConfig from './database.config';
import nestedDatabaseConfig from './nested-database.config';

@Module({})
export class AppModule {
  constructor(
    private readonly configService: ConfigService,
    @Optional()
    @Inject(databaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  static default(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          type: 'custom',
          configLoader: async () => ({
            port: 4000,
            timeout: 5000,
          }),
        }),
      ],
    };
  }

  static withMultipleFiles(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          type: 'custom',
          configLoader: async () => ({
            port: 3000,
            timeout: 5000,
          }),
        }),
      ],
    };
  }

  static withLoadedConfigurations(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          type: 'custom',
          configLoader: async () => ({
            port: 4000,
            timeout: 5000,
          }),
          load: [databaseConfig],
        }),
      ],
    };
  }

  static withNestedLoadedConfigurations(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          type: 'custom',
          configLoader: async () => ({
            port: 4000,
            timeout: 5000,
          }),
          load: [nestedDatabaseConfig],
        }),
      ],
    };
  }

  static withForFeature(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          type: 'custom',
          configLoader: async () => ({
            port: 4000,
            timeout: 5000,
          }),
        }),
        ConfigModule.forFeature(databaseConfig),
      ],
    };
  }

  getDatabaseHost() {
    return this.configService.get('database.host');
  }

  getDatabaseConfig() {
    return this.dbConfig;
  }

  getNestedDatabaseHost() {
    return this.configService.get('database.driver.host');
  }
}
