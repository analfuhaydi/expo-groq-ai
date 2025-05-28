import { ZodSchema } from "zod";
export type GroqMessage = {
    role: "user" | "system" | "assistant";
    content: string;
};
export declare const SUPPORTED_MODELS: readonly ["llama-3-70b", "llama-3-8b", "mixtral-8x7b", "gemma-7b-it"];
export type SupportedGroqModel = (typeof SUPPORTED_MODELS)[number];
export declare function groqStructured<T>({ messages, schema, model, }: {
    messages: GroqMessage[];
    schema: ZodSchema<T>;
    model?: SupportedGroqModel;
}): Promise<T>;
