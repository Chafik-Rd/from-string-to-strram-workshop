const text = "Hello สวัสดี 👋";

const chunked = ["Hello", " สวัส", "ดี", " 👋🏼"];

Bun.serve({
  port: 3000,
  fetch: () => {
    const stream = new ReadableStream<Uint8Array>({
      start: (controller) => {
        const encoder = new TextEncoder();

        let index = 0;

        const intervalId = setInterval(() => {
          const chunk = chunked[index];
          const bytes = encoder.encode(chunk);
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
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
});
