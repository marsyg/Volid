// src/inngest/functions.ts
import { inngest } from "../client";
import  {generateText}  from "ai"
import {google} from "@ai-sdk/google"
export const processTask = inngest.createFunction(
  { id: "demo-generate", triggers: { event: "demo/task.created" } },
  async ({  step }) => {
     await step.run("handle-task", async () => {
          return  await generateText({
                model : google('gemini-2.5-flash'),
                prompt : 'write a vegeterian reciepe'
            })
    });
    
  }
); 