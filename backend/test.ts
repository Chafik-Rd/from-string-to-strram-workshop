import { items } from "./mock_LLM_data";

const text = "Hello สวัสดี 👋";

const chunked = ["Hello", " สวัส", "ดี", " 👋🏼"];

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

          controller.enqueue(bytes);
          index += 1;

          if (index >= chunked.length) {
            controller.close();
            clearInterval(intervalId);
          }
        }, 1000);
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",

        // CORS:
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "false",
      },
    });
  },
});
