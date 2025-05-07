const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Preloaded file ID for OpenAI
const PRELOADED_FILE_ID = 'file-F9Y8YGjHXGKDtBVF3efdR7';

// Path to the responses file
const RESPONSES_FILE = path.join(__dirname, 'responses.txt');

// Function to read and parse responses file
async function getResponsesFromFile() {
    try {
        const content = await fs.readFile(RESPONSES_FILE, 'utf8');
        const lines = content.split('\n');
        const responses = {};
        
        for (const line of lines) {
            if (line.trim()) {
                const [key, value] = line.split('|').map(s => s.trim());
                if (key && value) {
                    responses[key.toLowerCase()] = value;
                }
            }
        }
        
        return responses;
    } catch (error) {
        console.error('Error reading responses file:', error);
        return {};
    }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const lowerMessage = message.toLowerCase();

        // First, check the responses file
        const responses = await getResponsesFromFile();
        let foundResponse = false;

        // Check if any key from responses file matches the message
        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                res.json({ response: value });
                foundResponse = true;
                break;
            }
        }

        // If no response found in file, proceed with OpenAI
        if (!foundResponse) {
            // Check if it's a file analysis request
            if (lowerMessage.includes('analyze file') || lowerMessage.includes('check file')) {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "Eres un asistente experto en análisis de código. Analiza el archivo proporcionado y da un resumen de su funcionalidad, estructura y posibles mejoras."
                        },
                        {
                            role: "user",
                            content: `Por favor, analiza el archivo con ID ${PRELOADED_FILE_ID}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                });

                res.json({ response: completion.choices[0].message.content });
            } else {
                // Regular chat message
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "Eres un asistente virtual de Lunova, una empresa de servicios de tecnología. Responde de manera profesional y amigable en español. Mantén las respuestas concisas y relevantes a los servicios de IT, soporte técnico, ciberseguridad y servicios en la nube."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                });

                res.json({ response: completion.choices[0].message.content });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error processing your request' });
    }
});

// Serve static files
app.use(express.static('.'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 