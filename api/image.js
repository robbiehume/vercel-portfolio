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
  
  // For now, return a placeholder response
  // In production, this would generate an image using DALL-E or similar
  const { title, prompt, user_id } = req.body;
  
  console.log('Image generation requested for:', title);
  
  // Return empty response to indicate no image
  // The frontend handles this gracefully
  res.status(200).json({ 
    message: 'Image generation is not configured in this deployment',
    img: null 
  });
}