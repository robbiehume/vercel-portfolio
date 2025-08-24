export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { query = '' } = req.body;
  
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a history teacher." },
        { role: "user", content: query }
      ],
      max_tokens: 1000
    });
    
    res.status(200).json({ 
      content: response.choices[0].message.content 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
