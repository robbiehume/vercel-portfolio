export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    environment: {
      has_openai_key: !!process.env.OPENAI_API_KEY,
      has_db_host: !!process.env.DB_HOST,
      has_jwt_secret: !!process.env.JWT_SECRET
    }
  });
}