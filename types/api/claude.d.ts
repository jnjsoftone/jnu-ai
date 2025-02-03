import Anthropic from '@anthropic-ai/sdk';
interface ClaudeOptions {
    model?: string;
    max_tokens?: number;
}
declare const chatClaude: (message?: string, api_key?: string, { model, max_tokens, }?: ClaudeOptions) => Promise<Anthropic.Messages.Message & {
    _request_id?: string | null | undefined;
}>;
export { chatClaude };
//# sourceMappingURL=claude.d.ts.map