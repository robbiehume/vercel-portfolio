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
  
  const { query = '' } = req.body;
  
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  
  try {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are a history teacher. Generate a detailed history lesson in this exact JSON format:
{
  "title": "Topic Title",
  "summary": "A brief 2-3 sentence summary",
  "explanation": "A detailed explanation of the topic (3-5 paragraphs)",
  "key_events": [
    {
      "name": "Event Name",
      "date": "Date/Year",
      "description": "Brief description of the event"
    }
  ],
  "important_figures": [
    {
      "name": "Person's Name",
      "reason": "Why they were important to this topic"
    }
  ],
  "related_topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
}
Return ONLY valid JSON (no markdown, no extra text).` 
        },
        { role: "user", content: query }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });
    
    // Parse the response and return in the format the app expects
    try {
      const contentString = response.choices[0].message.content;
      // Remove any markdown code blocks if present
      const cleanedContent = contentString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const structuredContent = JSON.parse(cleanedContent);
      
      res.status(200).json(structuredContent);
    } catch (parseError) {
      console.error('Failed to parse content JSON:', parseError);
      // Return a fallback structure
      res.status(200).json({ 
        title: query,
        summary: "Information about " + query,
        explanation: response.choices[0].message.content,
        key_events: [],
        important_figures: [],
        related_topics: []
      });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message 
    });
  }
}