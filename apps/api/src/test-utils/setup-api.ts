import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, InjectionToken, Type, ValidationPipe} from '@nestjs/common';

export type TestProviderOverride = {
  provide: InjectionToken;
  useValue: unknown;
};

export async function setupApi(moduleUnderTest: Type<unknown>, overrides: TestProviderOverride[] = []): Promise<{
  app: INestApplication;
  module: TestingModule;
}> {
  let testingModuleBuilder = Test.createTestingModule({
    imports: [moduleUnderTest],
  });

  for (const {provide, useValue} of overrides) {
    testingModuleBuilder = testingModuleBuilder.overrideProvider(provide).useValue(useValue);
  }

  const module = await testingModuleBuilder.compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
  app.useLogger(false);
  await app.init();

  return {app, module};
}
