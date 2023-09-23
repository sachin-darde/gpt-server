const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

const OPENAI_API_URL = "https://api.openai.com/v1/engines/davinci-codex/completions";
const API_KEY = process.env.API_KEY; // Replace with your actual OpenAI API key
// const ORGANIZATION = process.env.ORGANIZATION; // Replace with your actual OpenAI API key

const configuration = new Configuration(
    {
        // organization: ORGANIZATION,
        apiKey: API_KEY,

    },
);
const openai = new OpenAIApi(configuration);

// Initialize middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/chat', async (req, res) => {
    const { prompt, agent, temperature = 0.2 } = req.body || {};

    if (!prompt || !agent) {
        return res.status(400).json({ error: 'Missing parameters. Make sure to include prompt and agent.' });
    }


    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: parseFloat(temperature),
            messages: [{
                role: 'user',
                content: `${agent}\n${prompt}`,
            }],
        });
        const chatResponse = completion.data.choices[0].message.content.trim();
        const response = {
            chatResponse
        };
        // const parsedObject = JSON.parse(chatResponse);

        // // To pretty-print the JSON object
        // const prettyJsonString = JSON.stringify(parsedObject, null, 2);
        // console.log(prettyJsonString);

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
