interface ChatGeminiOptions {
    model?: string;
    stopSequences?: string[];
    maxOutputTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
}
declare const chatGemini: (message?: string, api_key?: string, { model, stopSequences, maxOutputTokens, temperature, topP, topK, }?: ChatGeminiOptions) => Promise<string>;
export { chatGemini };
//# sourceMappingURL=gemini.d.ts.map