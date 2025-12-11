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

export function StreamJSONLine() {
  const [text, setText] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const startStream = useCallback(async () => {
    setIsloading(true);
    setText("");

    const response = await fetch("http://localhost:3000/json-line");

    if (!response.body) {
      console.error("No response body");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        // JSON line
        const chunkStr = decoder.decode(value, { stream: true });
        const chunkJson = JSON.parse(chunkStr) as Chunk;
        if (chunkJson.type === "message.completed") {
          break;
        }
        setText((prevText) => prevText + chunkJson.delta.content);
      }
    }

    setIsloading(false);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-3xl my-4">Stream JSON line</h1>
      <button
        type="button"
        onClick={startStream}
        disabled={isLoading}
        className="p-2 bg-orange-200 rounded-xl"
      >
        {isLoading ? "Streaming..." : "Start Stream"}
      </button>
      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>{text}</div>
    </div>
  );
}
