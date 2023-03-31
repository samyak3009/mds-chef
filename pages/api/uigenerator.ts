// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import generatePrompt from "../../utils/generatePrompt";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type resData = {
  query : string,
  component : string,
  code : string
} | {message : string}

/**
 * Generate UI code for a sidesheet modal
 *
 * @route POST /api/uigenerator
 * @param {string} query - Query string to generate UI for
 * @param {string} component - Component name to generate UI for
 * @returns {object} - Generated UI code in string format
 */

export default async function uigenerator(
  req: NextApiRequest,
  res: NextApiResponse<resData>
) {

  if (req.method === 'OPTIONS') {
    return res.status(200).send({message:'ok'});
  }

  if (!configuration.apiKey) {
    res.status(500).json({
        message: "API key not configured."
    });
    return;
  }

    // Check if the request method is POST
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    // Check if the required query and component fields are present in the request body
    const { query='', component='' } = req.body;
    if (query.trim().length === 0) {
    res.status(400).json({
        message: "Please enter a valid query",
    });
    return;
  }
  if (component.trim().length === 0) {
    res.status(400).json({
        message: "Please select a component",
    });
    return;
  }

  // Generate UI code for the provided query and component
try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(component, query),
      temperature: 0,
      max_tokens: 3000,
      top_p: 0,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    // console.log(completion)
    const code = completion?.data?.choices[0]?.text?.replace('AI:', '') || '';
    res.status(200).json({query, component, code});
  } catch(error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
          message: 'An error occurred during your request.',
      });
    }
  }
}
