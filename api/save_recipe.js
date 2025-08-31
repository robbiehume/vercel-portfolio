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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { user_id, title, ingredients, instructions, image_prompt, servings } = req.body;
  
  if (!user_id || !title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    // Convert arrays to JSON strings for PostgreSQL JSONB columns
    const ingredientsJson = JSON.stringify(ingredients);
    const instructionsJson = JSON.stringify(instructions);
    
    const result = await pool.query(
      `INSERT INTO recipes (user_id, title, ingredients, instructions, image_prompt, servings) 
       VALUES ($1, $2, $3::jsonb, $4::jsonb, $5, $6) 
       RETURNING id`,
      [user_id, title, ingredientsJson, instructionsJson, image_prompt, servings]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Recipe saved successfully',
      recipe_id: result.rows[0].id
    });
  } catch (error) {
    console.error('Save recipe error:', error);
    res.status(500).json({ 
      message: 'Failed to save recipe',
      error: error.message 
    });
  }
}