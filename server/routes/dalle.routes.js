import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config);

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from DALL-E routes" });
})

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });

    const image = response.data.data[0].b64_json;

    res.status(200).json({ photo: image });
  } catch (error) {
    console.log(error);
    if (error.response) {
      // The request was made and the server responded with a status code
      console.log("Error response:", error.response);
      res.status(500).json({ message: "Error from DALL-E API", error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      console.log("Error request:", error.request);
      res.status(500).json({ message: "No response from DALL-E API", error: error.message });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  }
})

export default router;
