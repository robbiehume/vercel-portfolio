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
  
  const { title, prompt, user_id } = req.body;
  
  const apiKey = process.env.STABILITY_API_KEY;
  
  if (!apiKey) {
    console.log('Stability API key not configured');
    return res.status(200).json({ 
      img: null,
      message: 'Image generation not configured' 
    });
  }
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  try {
    console.log('Generating image for:', title);
    console.log('Using prompt:', prompt);
    
    // First try the Ultra model with multipart/form-data
    const formData = new URLSearchParams();
    formData.append('prompt', prompt);
    formData.append('output_format', 'png');
    
    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/generate/ultra',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'image/*',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      }
    );
    
    console.log('Stability API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ultra API error:', response.status, errorText);
      
      // Try the Core model as fallback
      console.log('Trying Core model as fallback...');
      
      const coreFormData = new URLSearchParams();
      coreFormData.append('prompt', prompt);
      coreFormData.append('output_format', 'png');
      
      const coreResponse = await fetch(
        'https://api.stability.ai/v2beta/stable-image/generate/core',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'image/*',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: coreFormData.toString()
        }
      );
      
      if (!coreResponse.ok) {
        const coreError = await coreResponse.text();
        console.error('Core API error:', coreResponse.status, coreError);
        
        // Try the v1 API as final fallback
        console.log('Trying v1 API as final fallback...');
        
        const v1Response = await fetch(
          'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              text_prompts: [{ text: prompt }],
              height: 1024,
              width: 1024,
              samples: 1,
              steps: 30
            })
          }
        );
        
        if (!v1Response.ok) {
          const v1Error = await v1Response.text();
          console.error('V1 API error:', v1Response.status, v1Error);
          return res.status(200).json({ 
            img: null,
            message: 'All image generation APIs failed',
            error: v1Error
          });
        }
        
        const v1Data = await v1Response.json();
        return res.status(200).json({ 
          img: v1Data.artifacts[0].base64
        });
      }
      
      // Core API succeeded - convert image to base64
      const coreBuffer = await coreResponse.arrayBuffer();
      const coreBase64 = Buffer.from(coreBuffer).toString('base64');
      
      return res.status(200).json({ 
        img: coreBase64
      });
    }
    
    // Ultra API succeeded - convert image to base64
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    res.status(200).json({ 
      img: base64
    });
    
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(200).json({ 
      img: null,
      message: 'Image generation error',
      error: error.message 
    });
  }
}