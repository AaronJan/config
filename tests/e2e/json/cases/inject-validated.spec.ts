import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { VALIDATED_CONFIGURATION_TOKEN } from '../../../../lib';
import { AppModule } from '../app.module';

describe('Inject validated config', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule.default()],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should return loaded configuration`, async () => {
    const config = await app.resolve(VALIDATED_CONFIGURATION_TOKEN);
    expect(config).toEqual({ timeout: 5000, port: 4000 });
  });

  afterEach(async () => {
    await app.close();
  });
});
