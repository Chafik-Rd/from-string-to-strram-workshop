import { useCallback, useState } from "react";

type Chunk = {
  id: string;
  type: "message.delta" | "message.completed";
  index: number;
  delta: {
    role?: string | undefined;
    content: string;
  };
  created: number;
  model: string;
};
function parseSSEEvent(event: string) {
    const lines = event.split("\n");

    const raw = lines.reduce(
        (acc, cur) => {
            if (cur.startsWith("data: ")) {
                acc.data = cur.replace("data: ", "");
            }
            if (cur.startsWith("id: ")) {
                acc.id = cur.replace("id: ", "");
            }
            if (cur.startsWith("event: ")) {
                acc.event = cur.replace("event: ", "");
            }

            return acc;
        },
        {
            id: undefined,
            event: undefined,
            data: undefined,
        } as {
            id?: string;
            event?: string;
            data?: string;
        },
    );
    if (!raw.data) return null;

    const done = raw.data === "[DONE]";

    if (done) return null;

    return {
        ...raw,
        data: JSON.parse(raw.data) as Chunk,
    };
}

export function StreamSSE2() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startStream = useCallback(async () => {
    setIsLoading(true);
    setText("");

    // use fetch
    const response = await fetch("http://localhost:3000/sse", {
      headers: {
        // for example only
        Authorization: "Bearer jwt-token",
      },
    });

    if (!response.ok || !response.body) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const decoder = new TextDecoder("utf-8");
    const reader = response.body.getReader();

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");

      buffer = events.pop() || "";
      // console.log("events", events);

      for (const event of events) {
        if (event.trim() === "") continue;

        const data = parseSSEEvent(event);
        if (data === null) continue;
        if (data.data.type === "message.completed") continue;
        setText((prev) => prev + data.data.delta?.content);
      }
    }

    setIsLoading(false);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-3xl my-4">Stream SSE (fetch)</h1>
      <button
        type="button"
        onClick={startStream}
        disabled={isLoading}
        className="p-2 bg-green-200 rounded-xl"
      >
        {isLoading ? "Streaming..." : "Start Stream"}
      </button>
      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>{text}</div>
    </div>
  );
}
