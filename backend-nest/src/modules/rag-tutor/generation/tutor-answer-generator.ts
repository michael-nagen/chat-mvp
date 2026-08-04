// Generation boundary for the RAG tutor. The tutor LangGraph depends on this
// abstraction, not on LangChain/OpenAI directly, so generation can be faked in
// tests (no credentials) and the LLM stack can be swapped without touching the
// graph. Receives only the user question and the pre-formatted, cited context.
export abstract class TutorAnswerGenerator {
  abstract generate(input: { question: string; context: string }): Promise<string>;
}
