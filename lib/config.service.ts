import { Inject, Injectable } from '@nestjs/common';
import get from 'lodash.get';
import { isUndefined } from 'util';
import { CONFIGURATION_KEY, CONFIGURATION_TOKEN } from './config.constants';
import { NoInferType } from './types';

@Injectable()
export class ConfigService<K = Record<string, any>> {
  constructor(
    @Inject(CONFIGURATION_TOKEN)
    private readonly internalConfig: Record<string, any> = {},
  ) {}

  /**
   * Get a configuration value (either custom configuration or process environment variable)
   * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
   * It returns a default value if the key does not exist.
   * @param propertyPath
   * @param defaultValue
   */
  get<T = any>(propertyPath: keyof K): T | undefined;
  /**
   * Get a configuration value (either custom configuration or process environment variable)
   * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
   * It returns a default value if the key does not exist.
   * @param propertyPath
   * @param defaultValue
   */
  get<T = any>(propertyPath: keyof K, defaultValue: NoInferType<T>): T;
  /**
   * Get a configuration value (either custom configuration or process environment variable)
   * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
   * It returns a default value if the key does not exist.
   * @param propertyPath
   * @param defaultValue
   */
  get<T = any>(propertyPath: keyof K, defaultValue?: T): T | undefined {
    const validatedEnvValue = get(
      this.internalConfig[CONFIGURATION_KEY],
      propertyPath,
    );
    if (!isUndefined(validatedEnvValue)) {
      return (validatedEnvValue as unknown) as T;
    }
    const processValue = get(process.env, propertyPath);
    if (!isUndefined(processValue)) {
      return (processValue as unknown) as T;
    }
    const internalValue = get(this.internalConfig, propertyPath);
    return isUndefined(internalValue) ? defaultValue : internalValue;
  }
}
