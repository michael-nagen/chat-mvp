import { Injectable } from '@nestjs/common';
import { TutorAnswerGenerator } from './tutor-answer-generator';

// Deterministic, dependency-free generation for tests/local dev: echoes that the
// answer is grounded in the provided context and cites the first source. No
// network, no credentials — selected via RAG_TUTOR_PROVIDER=fake.
@Injectable()
export class FakeTutorAnswerGenerator extends TutorAnswerGenerator {
  generate({ question }: { question: string; context: string }): Promise<string> {
    return Promise.resolve(
      `Based on your knowledge base, here is a grounded answer to "${question}" [Source 1].`,
    );
  }
}
