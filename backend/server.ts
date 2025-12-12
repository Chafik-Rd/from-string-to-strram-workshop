import { items } from "./mock_LLM_data";

const text = "Hello สวัสดี 👋";

const chunked = ["Hello", " สวัส", "ดี", " 👋🏼"];

const headersFn = (pathname: string) => {
  let HEADERS = {};

  if (pathname === "/sse") {
    // SSE
    HEADERS = {
      headers: {
        // CRITICAL: This tells the browser it's SSE
        "Content-Type": "text/event-stream",
        // Disable caching (important for streaming)
        "Cache-Control": "no-cache",
        // Keep connection alive
        Connection: "keep-alive",

        // CORS:
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "false",
      },
    };
  } else {
    // text and JSON line
    HEADERS = {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",

        // CORS:
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "false",
      },
    };
  }
  return HEADERS;
};
Bun.serve({
  port: 3000,
  fetch: (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const stream = new ReadableStream<Uint8Array>({
      start: (controller) => {
        const encoder = new TextEncoder();

        let index = 0;

        const intervalId = setInterval(() => {
          let bytes;

          // text
          if (pathname === "/text") {
            const chunk = chunked[index];
            bytes = encoder.encode(chunk);
          }

          // JSON line
          if (pathname === "/json-line") {
            const chunk = items[index];
            const chunkStr = JSON.stringify(chunk);
            bytes = encoder.encode(chunkStr);
          }

          // SSE
          if (pathname === "/sse") {
            const chunk = items[index];
            const chunkStr = JSON.stringify(chunk);
            const messageLines = [
              `id: ${index}`,
              `event: chat_delta`,
              `data: ${chunkStr}`,
            ];
            const message = `${messageLines.join("\n")}\n\n`;
            console.log({ index, chunkStr, message });

            bytes = encoder.encode(message);
          }

          controller.enqueue(bytes);
          index += 1;

          // text
          if (pathname === "/text") {
            if (index >= chunked.length) {
              controller.close();
              clearInterval(intervalId);
            }
          }

          // JSON line
          if (pathname === "/json-line") {
            if (index >= items.length) {
              controller.close();
              clearInterval(intervalId);
            }
          }

          // SSE
          if (pathname === "/sse") {
            if (index >= items.length) {
              // Optional: send a final "done" signal
              // OpenAI sends "data: [DONE]\n\n"
              const completeMessage = `${[
                "event: chat_completed",
                "data: [DONE]",
              ].join("\n")}\n\n`;
              controller.enqueue(encoder.encode(completeMessage));
              controller.close();
              clearInterval(intervalId);
            }
          }
        }, 1000);
      },
    });
    return new Response(stream, headersFn(pathname));
  },
});
