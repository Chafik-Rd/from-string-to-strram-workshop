import { useCallback, useState } from "react";

export function StreamText() {
  const [text, setText] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const startStream = useCallback(async () => {
    setIsloading(true);
    setText("");

    const response = await fetch("http://localhost:3000/text");

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
        // text
        const chunkStr = decoder.decode(value, { stream: true });
        setText((prevText) => prevText + chunkStr);
      }
    }

    setIsloading(false);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-3xl my-4">Stream text</h1>
      <button
        type="button"
        onClick={startStream}
        disabled={isLoading}
        className="p-2 bg-blue-200 rounded-xl"
      >
        {isLoading ? "Streaming..." : "Start Stream"}
      </button>
      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>{text}</div>
    </div>
  );
}
