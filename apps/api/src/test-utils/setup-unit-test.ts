import {Test, TestingModule} from '@nestjs/testing';
import {Type, InjectionToken} from '@nestjs/common';

export async function setupUnitTest<T>(
  service: Type<T>,
  providers: {provide: InjectionToken; useValue: unknown}[] = []
): Promise<T> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [service, ...providers.map(({provide, useValue}) => ({provide, useValue}))],
  }).compile();

  return module.get<T>(service);
}
