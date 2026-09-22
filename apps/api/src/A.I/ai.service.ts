import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateText, stepCountIs } from 'ai';
import { groq } from '@ai-sdk/groq';

import { AiToolsService } from './ai-tools.service';
import { ChatResult, EventData } from '@wander/types';
import { WANDER_AGENT_SYSTEM_PROMPT } from './wander-agents-prompts';

@Injectable()
export class AiService {
  constructor(private readonly aiToolsService: AiToolsService) {}

  async chat(message: string): Promise<ChatResult> {
    try {
      let matchedEvents: EventData[] = [];
      let searchPerformed = false;

      const { text } = await generateText({
        model: groq('openai/gpt-oss-120b'),
        instructions: WANDER_AGENT_SYSTEM_PROMPT,
        tools: this.aiToolsService.getTools((events) => {
          matchedEvents = events;
          searchPerformed = true;
        }),
        stopWhen: stepCountIs(3),
        prompt: message,
      });

      if (searchPerformed && matchedEvents.length === 0) {
        return {
          message: "Je n'ai trouvé aucun événement correspondant à ta recherche.",
          events: [],
        };
      }
      return {
        message: text,
        events: matchedEvents,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('ERROR_MESSAGE_FAILED_TO_GENERATE_TEXT');
    }
  }
}
