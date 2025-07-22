export default function handler(req, res) {
    const apiKey = process.env.OPENAI_API_KEY;
    res.status(200).json({
      found: !!apiKey,
      keyStartsWith: apiKey?.slice(0, 5) || "undefined",
    });
  }