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
  
  const { recipe_id } = req.query;
  
  if (!recipe_id) {
    return res.status(400).json({ message: 'Recipe ID is required' });
  }
  
  try {
    const result = await pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [recipe_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const recipe = result.rows[0];
    
    res.status(200).json({
      id: recipe.id,
      user_id: recipe.user_id,
      title: recipe.title,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      image_prompt: recipe.image_prompt,
      image_path: recipe.image_path,
      created_at: recipe.created_at
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve recipe',
      error: error.message 
    });
  }
}