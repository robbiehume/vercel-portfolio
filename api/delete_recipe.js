export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // For now, return a stub response
  // In production, this would delete from a database
  const { recipe_id } = req.query;
  
  console.log('Delete requested for recipe:', recipe_id);
  
  // Return success response
  res.status(200).json({ 
    success: true,
    message: 'Recipe deletion is not configured in this deployment',
    recipe_id: recipe_id
  });
}