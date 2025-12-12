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

export function StreamSSE() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startStream = useCallback(async () => {
    setIsLoading(true);
    setText("");

    const eventSource = new EventSource("http://localhost:3000/sse");

    eventSource.addEventListener("chat_delta", (event) => {
      const data = JSON.parse(event.data) as Chunk;
      console.log({ data });
      if (data.delta?.content) {
        setText((prev) => prev + data.delta?.content);
      }
    });

    eventSource.addEventListener("chat_completed", (event) => {
      console.log("Stream completed:", event.data);
      eventSource.close();
      setIsLoading(false);
    });

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      console.log("obj", JSON.stringify(err));
      eventSource.close();
      setIsLoading(false);
    };
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-3xl my-4">Stream SSE</h1>
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
