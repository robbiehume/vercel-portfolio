export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // For now, return a sample recipe
  // In production, this would fetch from a database
  const { recipe_id } = req.query;
  
  console.log('Saved recipe requested:', recipe_id);
  
  // Return a sample recipe
  res.status(200).json({
    title: "Sample Saved Recipe",
    servings: "4",
    ingredients: ["This feature requires database configuration"],
    instructions: ["Database storage is not configured in this deployment"],
    image_prompt: "A delicious meal"
  });
}