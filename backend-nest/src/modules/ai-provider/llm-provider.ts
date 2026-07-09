import {
  CompleteParams,
  ProviderTurnEvent,
  StreamTurnParams,
} from './ai-provider.types';

export abstract class LlmProvider {
  abstract complete(params: CompleteParams): Promise<string>;

  abstract streamTurn(params: StreamTurnParams): AsyncIterable<ProviderTurnEvent>;
}
