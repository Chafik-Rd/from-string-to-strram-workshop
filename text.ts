const text = "Hello สวัสดี 👋";

const encoder = new TextEncoder();
const bytes = encoder.encode(text);
console.log("bytes",bytes)

const decoder = new TextDecoder()
const decodedText = decoder.decode(bytes)
console.log("decodedText",decodedText)