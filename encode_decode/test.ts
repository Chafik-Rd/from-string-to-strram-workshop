const text = "Hello สวัสดี 👋";

const encoder = new TextEncoder();
const bytes = encoder.encode(text);
console.log("bytes:", bytes);

const bytePart1 = bytes.slice(0, 20);
const bytePart2 = bytes.slice(20);
const decoder = new TextDecoder("utf-8");

// stream จะรอให้ byte ครบแล้วค่อยส่งมา
const decodedText1 = decoder.decode(bytePart1, { stream: true });
const decodedText2 = decoder.decode(bytePart2, { stream: false });

console.log({ decodedText1, decodedText2 });
const fullText = decodedText1 + decodedText2;
console.log("decodedText:", fullText);
