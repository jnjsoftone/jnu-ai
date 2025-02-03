interface PerplexityOptions {
    model?: string;
    system?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    search_domain_filter?: string[];
    return_images?: boolean;
    return_related_questions?: boolean;
    search_recency_filter?: string;
    top_k?: number;
    stream?: boolean;
    presence_penalty?: number;
    frequency_penalty?: number;
}
declare const chatPerplexity: (message?: string, api_key?: string, { model, system, max_tokens, temperature, top_p, search_domain_filter, return_images, return_related_questions, search_recency_filter, top_k, stream, presence_penalty, frequency_penalty }?: PerplexityOptions) => Promise<unknown>;
export { chatPerplexity };
//# sourceMappingURL=perplexity.d.ts.map