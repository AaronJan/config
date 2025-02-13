import { FactoryProvider } from '@nestjs/common/interfaces';
import { v4 as uuid } from 'uuid';
import { ConfigFactory } from '../interfaces';
import { getConfigToken } from './get-config-token.util';
import { ConfigFactoryKeyHost } from './register-as.util';
import { CONFIGURATION_TOKEN } from '../config.constants';

export function createConfigProvider(
  factory: ConfigFactory & ConfigFactoryKeyHost,
): FactoryProvider {
  return {
    provide: factory.KEY || getConfigToken(uuid()),
    useFactory: factory,
    inject: [CONFIGURATION_TOKEN],
  };
}
