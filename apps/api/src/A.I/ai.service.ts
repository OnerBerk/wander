import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

@Injectable()
export class AiService {
  async chat(message: string) {
    try {
      const { text } = await generateText({
        model: groq('openai/gpt-oss-120b'),
        prompt: message,
      });
      return text;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('ERROR_MESSAGE_FAILED_TO_GENERATE_TEXT');
    }
  }
}
