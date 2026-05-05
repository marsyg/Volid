import {OpenRouter} from "@openrouter/sdk"

export const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
    httpReferer: "https://localhost:3000",
    appTitle : "Volid",
});