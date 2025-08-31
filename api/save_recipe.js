export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // For now, return success without actually saving
  // In production, this would save to a database
  const { user_id, title, ingredients, instructions, image_prompt, servings } = req.body;
  
  console.log('Recipe save requested:', title);
  
  // Return success response
  res.status(200).json({ 
    success: true,
    message: 'Recipe saving is not configured in this deployment',
    recipe_id: Math.random().toString(36).substr(2, 9)
  });
}