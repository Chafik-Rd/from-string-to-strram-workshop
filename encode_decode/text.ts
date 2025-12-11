const text = "Hello สวัสดี 👋";

const encoder = new TextEncoder();
const bytes = encoder.encode(text);
console.log("bytes:",bytes)

const decoder = new TextDecoder()
const decodedText = decoder.decode(bytes)
console.log("decodedText:",decodedText)


// English - 1 char = 1 bytes
// Thailand - 1 char = 3 bytes
// Emoji  - 1 char = 4 bytes