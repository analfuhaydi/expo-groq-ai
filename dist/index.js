var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Groq } from "groq-sdk";
// Initialize GROQ client with API key (set by user of SDK)
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
// Supported models — add more later if GROQ adds them
export const SUPPORTED_MODELS = [
    "llama-3-70b",
    "llama-3-8b",
    "mixtral-8x7b",
    "gemma-7b-it",
];
export function groqStructured(_a) {
    return __awaiter(this, arguments, void 0, function* ({ messages, schema, model = "llama-3-70b", // default fallback
     }) {
        var _b, _c;
        if (!SUPPORTED_MODELS.includes(model)) {
            throw new Error(`Unsupported model: ${model}. Supported models are: ${SUPPORTED_MODELS.join(", ")}`);
        }
        const res = yield client.chat.completions.create({
            model: "",
            temperature: 0,
            response_format: { type: "json_object" },
            messages,
        });
        const content = (_c = (_b = res.choices[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        try {
            const json = JSON.parse(content || "");
            return schema.parse(json);
        }
        catch (err) {
            if (err.name === "ZodError") {
                console.error("❌ Zod validation failed:", err.errors);
            }
            else {
                console.error("❌ JSON parsing failed:", err);
            }
            throw err;
        }
    });
}
