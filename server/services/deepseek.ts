// DeepSeek API integration as backup for Gemini
export async function generateQuestionsWithDeepSeek(
  jobDescription: string,
  resume: string
): Promise<any[]> {
  try {
    // Decode base64 data to text, with fallback for already decoded text
    let decodedJobDescription: string;
    let decodedResume: string;
    
    try {
      decodedJobDescription = Buffer.from(jobDescription, 'base64').toString('utf-8');
      decodedResume = Buffer.from(resume, 'base64').toString('utf-8');
    } catch (decodeError) {
      // If base64 decoding fails, assume it's already text
      decodedJobDescription = jobDescription;
      decodedResume = resume;
    }
    
    console.log("DeepSeek - Job Description preview:", decodedJobDescription.substring(0, 200) + "...");
    console.log("DeepSeek - Resume preview:", decodedResume.substring(0, 200) + "...");
    
    const prompt = `Based on the following job description and candidate resume, generate 10 interview questions with progressive difficulty that create a natural conversation flow.

Job Description:
${decodedJobDescription}

Resume:
${decodedResume}

Generate questions in this order:
1-3: Warm-up questions (basic experience, motivations, role understanding)
4-6: Core technical/role-specific questions (medium difficulty)
7-8: Deep technical scenarios with "why" and "how" follow-ups (challenging)
9-10: Advanced problem-solving and behavioral scenarios (most challenging)

Start with: "Hello! Please tell me your name and how many years of experience you have in your field?"

Return as JSON array with 'question', 'category' (warmup/technical/behavioral/advanced), and 'difficulty' (easy/medium/hard) fields.`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview question generator. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.questions || parsed; // Handle different response formats
    }
    
    throw new Error("No content in DeepSeek response");
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw error;
  }
}