const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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
  
  const { user_id } = req.query;
  
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  
  try {
    const result = await pool.query(
      'SELECT id, title, servings, created_at FROM recipes WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    
    const recipes = result.rows.map(recipe => ({
      id: recipe.id,
      title: recipe.title
    }));
    
    // Return just the array, matching the original API format
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Get user recipes error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve user recipes',
      error: error.message 
    });
  }
}