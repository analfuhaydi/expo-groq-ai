import { Groq } from "groq-sdk";
import { ZodSchema } from "zod";

// Initialize GROQ client with API key (set by user of SDK)
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export type GroqMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

// Supported models — add more later if GROQ adds them
export const SUPPORTED_MODELS = [
  "llama-3-70b",
  "llama-3-8b",
  "mixtral-8x7b",
  "gemma-7b-it",
] as const;

export type SupportedGroqModel = (typeof SUPPORTED_MODELS)[number];

export async function groqStructured<T>({
  messages,
  schema,
  model = "llama-3-70b", // default fallback
}: {
  messages: GroqMessage[];
  schema: ZodSchema<T>;
  model?: SupportedGroqModel;
}): Promise<T> {
  if (!SUPPORTED_MODELS.includes(model as SupportedGroqModel)) {
    throw new Error(
      `Unsupported model: ${model}. Supported models are: ${SUPPORTED_MODELS.join(
        ", "
      )}`
    );
  }

  const res = await client.chat.completions.create({
    model: "",
    temperature: 0,
    response_format: { type: "json_object" },
    messages,
  });

  const content = res.choices[0]?.message?.content;

  try {
    const json = JSON.parse(content || "");
    return schema.parse(json);
  } catch (err: any) {
    if (err.name === "ZodError") {
      console.error("❌ Zod validation failed:", err.errors);
    } else {
      console.error("❌ JSON parsing failed:", err);
    }
    throw err;
  }
}
