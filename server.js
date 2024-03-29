import express from 'express';
import path from 'path';
const app = express();
const port = 3030;
import fs from 'fs';
import axios from 'axios';
import OpenAI from 'openai' ;
import bodyParser from 'body-parser'   // really important otherwise the body of the request is empty
app.use(bodyParser.urlencoded({ extended: false }));

// get OPENAI_API_KEY from GitHub secrets
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apiKey: OPENAI_API_KEY});

// Middleware to parse JSON payloads in POST requests
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static('./'));

// Serve index.html at the root URL '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// GET route
app.post('/test-prompt', async(req, res) => {
    const topic = req.body.topic;
    const style = req.body.style;
    const tone = req.body.tone;
    const language = req.body.language;
    // send back to Web page
    res.json({  message: "Write a 100 word article on this topic: " + topic + ", using this tone: " + tone + " in this style: " + style + " in this language: " + language });
});
//
// 
//INSERT ROUTE TO CALL OPENAI -COMPLETE THIS CODE
// app.post('/prompt', async(req, res) => {
// This route should send the prompt to OpenAI and return the response to the Web page- COMPLETE THIS CODE
    
// Test API key
app.get('/test-key', async (req, res) => {
  console.log("test-key")
  try {
    console.log("in test-key:" + openai.apiKey)
    let messages = [
      { role: "user", content: "Say hello world in French" },
  ]
    let response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: messages,
      max_tokens: 100,
      temperature: 0.5,
    })
    let message = response.choices[0].message.content;
    console.log(message);
    res.status(200).json(message);
  } catch (error) {
      return console.error('Error:', error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
