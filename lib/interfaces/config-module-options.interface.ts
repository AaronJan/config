import { ConfigFactory } from './config-factory.interface';

export interface ConfigModuleEnvFileOptions {
  type: 'env';
  envFile?: {
    ignoreEnvFile?: boolean;

    /**
     * Path to the environment file(s) to be loaded.
     */
    filePath?: string | string[];

    /**
     * Environment file encoding.
     */
    encoding?: string;

    /**
     * A boolean value indicating the use of expanded variables.
     * If .env contains expanded variables, they'll only be parsed if
     * this property is set to true.
     */
    expandVariables?: boolean;

    /**
     * If "true", predefined environment variables will not be validated.
     */
    ignoreEnvVars?: boolean;
  };
}

export interface ConfigModuleJsonFileOptions {
  type: 'json';
  jsonFile?: {
    /**
     * Path to the JSON file(s) to be loaded.
     */
    filePath?: string | string[];

    /**
     * Environment file encoding.
     */
    encoding?: string;
  };
}

export interface ConfigModuleCustomLoaderOptions {
  type: 'custom';
  configLoader: () => Promise<Record<string, any>>;
}

interface ConfigModuleBaseOptions {
  /**
   * If "true", registers `ConfigModule` as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;

  /**
   * Environment variables validation schema (Joi).
   */
  validationSchema?: any;

  /**
   * Schema validation options.
   * See: https://hapi.dev/family/joi/?v=16.1.8#anyvalidatevalue-options
   */
  validationOptions?: Record<string, any>;

  /**
   * Array of custom configuration files to be loaded.
   * See: https://docs.nestjs.com/techniques/configuration
   */
  load?: Array<ConfigFactory>;
}

export type ConfigModuleOptions = ConfigModuleBaseOptions &
  (
    | ConfigModuleEnvFileOptions
    | ConfigModuleJsonFileOptions
    | ConfigModuleCustomLoaderOptions
  );
