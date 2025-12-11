// Sure, I can help with that.  First we'll look at the server implementation, then we'll build a small React client.

export const items = [
    {
        id: "chatcmpl-9abc123",
        type: "message.delta",
        index: 0,
        delta: {
            role: "assistant",
            content: "Sure, I can help with that.",
        },
        created: 1730876800,
        model: "gpt-5.1-mini",
    },
    {
        id: "chatcmpl-9abc123",
        type: "message.delta",
        index: 1,
        delta: {
            content: " First we'll look at the server implementation, ",
        },
    },
    {
        id: "chatcmpl-9abc123",
        type: "message.delta",
        index: 2,
        delta: {
            content: "then we'll build a small React client.",
        },
    },
    {
        id: "chatcmpl-9abc123",
        type: "message.completed",
        index: 3,
        done: true,
        usage: {
            input_tokens: 128,
            output_tokens: 256,
            total_tokens: 384,
        },
    },
];