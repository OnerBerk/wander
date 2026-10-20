import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateText, stepCountIs } from 'ai';
import { groq } from '@ai-sdk/groq';

import { AiToolsService } from './ai-tools.service';
import { ChatResult } from '@wander/types';
import { WANDER_AGENT_SYSTEM_PROMPT } from './wander-agents-prompts';

@Injectable()
export class AiService {
  constructor(private readonly aiToolsService: AiToolsService) {}

  async chat(message: string): Promise<ChatResult> {
    try {
      const { text, toolResults } = await generateText({
        model: groq('openai/gpt-oss-120b'),
        instructions: WANDER_AGENT_SYSTEM_PROMPT,
        tools: this.aiToolsService.getTools(),
        stopWhen: stepCountIs(3),
        prompt: message,
      });

      const lastSearch = toolResults.findLast((result) => result.toolName === 'getEvents' && !result.dynamic);

      if (!lastSearch) {
        return { message: text, events: [] };
      }

      if (lastSearch.output.events.length === 0) {
        return {
          message: "Je n'ai trouvé aucun événement correspondant à ta recherche.",
          events: [],
        };
      }

      return {
        message: text,
        events: lastSearch.output.events,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('ERROR_MESSAGE_FAILED_TO_GENERATE_TEXT');
    }
  }
}
