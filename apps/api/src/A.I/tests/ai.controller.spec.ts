import { INestApplication } from '@nestjs/common';
import { ChatResult } from '@wander/types';
import { setupApi } from '../../test-utils/setup-api';
import { TestTool } from '../../test-utils/test-tools';
import { AiModule } from '../ai.module';
import { AiService } from '../ai.service';

const mockChatResult: ChatResult = {
  message: 'Voici des événements.',
  events: [],
};

const mockAiService = {
  chat: jest.fn(),
};

const invalidBodies: [string, object][] = [
  ['ERROR_MESSAGE_REQUIRED', {}],
  ['ERROR_MESSAGE_NOT_EMPTY', { message: '' }],
  ['ERROR_MESSAGE_MIN_LENGTH_MIN_5', { message: 'hey' }],
  ['ERROR_MESSAGE_STRING', { message: 123 }],
  ['ERROR_MESSAGE_MAX_LENGTH_MAX_1000', { message: 'a'.repeat(1001) }],
];

describe('POST /ai/chat', () => {
  let app: INestApplication;
  let testTool: TestTool;

  beforeAll(async () => {
    ({ app } = await setupApi(AiModule, [{ provide: AiService, useValue: mockAiService }]));
    testTool = new TestTool(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testTool.destroy();
  });

  it('returns 201 with the chat result', async () => {
    mockAiService.chat.mockResolvedValue(mockChatResult);

    const res = await testTool.post('/ai/chat', { message: 'Concerts ce week-end' });

    expect(res.body).toEqual({ response: mockChatResult });
    expect(mockAiService.chat).toHaveBeenCalledWith('Concerts ce week-end');
  });

  it.each(invalidBodies)('returns 400 with %s', async (expectedMessage, body) => {
    const res = await testTool.post('/ai/chat', body, 400);

    expect(res.body.message).toEqual(expect.arrayContaining([expectedMessage]));
    expect(mockAiService.chat).not.toHaveBeenCalled();
  });
});
