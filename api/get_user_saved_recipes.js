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
  
  // For now, return an empty list
  // In production, this would fetch from a database
  const { user_id } = req.query;
  
  console.log('Saved recipes requested for user:', user_id);
  
  // Return empty list (no database configured)
  res.status(200).json({ 
    recipes: [],
    message: 'Recipe storage is not configured in this deployment'
  });
}