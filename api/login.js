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
  
  // For now, return a stub response
  // In production, this would validate credentials against a database
  const { username, password } = req.body;
  
  console.log('Login requested for:', username);
  
  // Return success response with dummy data
  res.status(200).json({ 
    success: true,
    message: 'User authentication is not configured in this deployment',
    user_id: Math.random().toString(36).substr(2, 9),
    username: username || 'guest'
  });
}