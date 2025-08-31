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
  
  const { topic = '', difficulty = 'medium' } = req.body;
  
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
          content: `Generate a history quiz with 5 multiple choice questions. 
Return ONLY a valid JSON array (no markdown, no extra text) in this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]
The "correct" field should be the index (0-3) of the correct answer in the options array.` 
        },
        { 
          role: "user", 
          content: `Create a ${difficulty} difficulty quiz about ${topic}` 
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });
    
    // Parse the response and return in the format the app expects
    try {
      const quizContent = response.choices[0].message.content;
      // Remove any markdown code blocks if present
      const cleanedContent = quizContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const questions = JSON.parse(cleanedContent);
      
      // Convert the format to what the app expects (answer as text, not index)
      const formattedQuestions = questions.map(q => ({
        question: q.question,
        options: q.options,
        answer: q.options[q.correct] // Convert index to actual answer text
      }));
      
      // Return in the format the app expects
      res.status(200).json({ 
        questions: formattedQuestions 
      });
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
      // Try to return a default quiz if parsing fails
      res.status(200).json({ 
        questions: [
          {
            question: "Quiz generation had an issue. Here's a default question: What year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            answer: "1945"
          }
        ]
      });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz',
      details: error.message 
    });
  }
}