import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { TutorAnswerGenerator } from './tutor-answer-generator';
import { RAG_TUTOR_SYSTEM_PROMPT } from '../prompts/rag-tutor.prompt';
import { OPENAI_API_KEY_ENV, OPENAI_MODEL } from '../../ai-provider/ai-provider.constants';

// LangChain-based answer generation, encapsulated inside the RAG tutor layer.
// A grounded prompt (system rules + cited context + question) is piped through
// ChatOpenAI to a string. The model is built lazily so the app boots without a
// key; only an actual tutor answer requires OPENAI_API_KEY.
@Injectable()
export class LangChainTutorAnswerGenerator extends TutorAnswerGenerator {
  private model: ChatOpenAI | undefined;

  constructor(private readonly config: ConfigService) {
    super();
  }

  async generate({
    question,
    context,
  }: {
    question: string;
    context: string;
  }): Promise<string> {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', RAG_TUTOR_SYSTEM_PROMPT],
      ['human', 'Context:\n{context}\n\nQuestion: {question}'],
    ]);
    // Invoke the model directly (rather than prompt.pipe(model)) to avoid the
    // Runnable generic-variance friction between @langchain/core and
    // @langchain/openai; StringOutputParser extracts plain text from the reply.
    const promptValue = await prompt.invoke({ context, question });
    const reply = await this.getModel().invoke(promptValue);
    return new StringOutputParser().invoke(reply);
  }

  private getModel(): ChatOpenAI {
    if (!this.model) {
      this.model = new ChatOpenAI({
        apiKey: this.config.getOrThrow<string>(OPENAI_API_KEY_ENV),
        model: OPENAI_MODEL,
        temperature: 0,
      });
    }
    return this.model;
  }
}
