export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Handle both GET and POST
  let prompt, ingredients, dietary, cuisine;
  
  if (req.method === 'GET') {
    // Handle GET request with query parameters (how the recipe app calls it)
    prompt = req.query.prompt || '';
    ingredients = [];
    dietary = [];
    cuisine = '';
  } else if (req.method === 'POST') {
    // Handle POST request with body
    ({ ingredients = [], dietary = [], cuisine = '' } = req.body);
    prompt = '';
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  
  try {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
    
    // Use the prompt directly if provided (GET), otherwise build it (POST)
    let fullPrompt = prompt;
    if (!fullPrompt && ingredients.length > 0) {
      fullPrompt = `Create a detailed recipe using these ingredients: ${ingredients.join(', ')}`;
      if (dietary && dietary.length > 0) {
        fullPrompt += ` with dietary restrictions: ${dietary.join(', ')}`;
      }
      if (cuisine) {
        fullPrompt += ` in ${cuisine} style`;
      }
    }
    
    if (!fullPrompt) {
      fullPrompt = "Create a random delicious recipe";
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are a helpful cooking assistant. Generate recipes in this exact JSON format:
{
  "title": "Recipe Name",
  "servings": "4",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "image_prompt": "A short description for generating an image of this dish"
}` 
        },
        { role: "user", content: fullPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });
    
    // Parse the response as JSON
    try {
      const recipeData = JSON.parse(response.choices[0].message.content);
      res.status(200).json(recipeData);
    } catch (parseError) {
      // If parsing fails, return the raw content
      res.status(200).json({ 
        title: "Recipe",
        content: response.choices[0].message.content,
        error: "Could not parse recipe format"
      });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate recipe',
      details: error.message 
    });
  }
}