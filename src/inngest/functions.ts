import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("molecule-nextjs-testtemp2");
      return sandbox.sandboxId;
    });
    const writer = createAgent({
      name: "writer",
      system:
        "You are an expert writer.  You write readable, concise, simple content.",
      model: gemini({ model: "gemini-2.5-flash" }),
    });
    const { output } = await writer.run(
      `write a poem about: ${event.data.value}`
    );
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxUrl };
  }
);
