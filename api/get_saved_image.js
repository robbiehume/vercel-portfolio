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
  
  // For now, return 404 as we don't have image storage
  // In production, this would fetch from a database or storage service
  const { title, user_id } = req.query;
  
  console.log('Saved image requested for:', title);
  
  // Return 404 to trigger fallback behavior in frontend
  res.status(404).json({ 
    error: 'Image not found',
    message: 'Image storage is not configured in this deployment'
  });
}