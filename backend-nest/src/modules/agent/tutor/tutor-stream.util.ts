// The tutor generator returns a whole answer string, but the UI streams like the
// assistant does. Split the answer into word-sized pieces (each keeping its
// trailing whitespace) so it renders progressively without altering the text:
// joining the pieces reproduces the original answer exactly.
export function splitAnswerIntoTokens(answer: string): string[] {
  return answer.match(/\S+\s*|\s+/g) ?? [];
}
