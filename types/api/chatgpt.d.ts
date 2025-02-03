interface ChatGPTOptions {
    model?: string;
    system?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stream?: boolean;
}
declare const chatGpt: (message?: string, api_key?: string, { model, system, max_tokens, temperature, top_p, frequency_penalty, presence_penalty, stream }?: ChatGPTOptions) => Promise<unknown>;
export { chatGpt };
//# sourceMappingURL=chatgpt.d.ts.map