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
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { recipe_id, user_id } = req.query;
  
  if (!recipe_id || !user_id) {
    return res.status(400).json({ message: 'Recipe ID and User ID are required' });
  }
  
  try {
    // Delete the recipe (only if it belongs to the user)
    const result = await pool.query(
      'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING id',
      [recipe_id, user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Recipe not found or you do not have permission to delete it' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Recipe deleted successfully',
      deleted_id: result.rows[0].id
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ 
      message: 'Failed to delete recipe',
      error: error.message 
    });
  }
}