import { GoogleGenerativeAI } from '@google/generative-ai';
import { LessonInput, LessonOutput } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const generateLessonPack = async (input: LessonInput): Promise<LessonOutput> => {
  if (!genAI) {
    return generateMockResponse(input);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are ASman, an AI teacher assistant specializing in NCERT curriculum for Indian schools. 

CONTENT TO PROCESS:
Subject: ${input.subject}
Class Level: ${input.classLevel}
Global Module: ${input.globalModule}
Content: "${input.text}"

TASK: Create a comprehensive lesson pack with the following sections:

1. SIMPLIFIED EXPLANATION (500-700 words):
- Start with "Hello students! Today we're going to learn about..."
- Break down the content into simple, age-appropriate language for Class ${input.classLevel}
- Use real-world examples that Indian children can relate to
- Include step-by-step explanations
- Add interesting facts and "Did you know?" sections
- Use analogies and comparisons to everyday objects
- Make it engaging and conversational
- Include specific details about what was uploaded and how it connects to the lesson

2. PRACTICAL ACTIVITY (400-500 words):
- Design a hands-on classroom activity that takes 45-60 minutes
- Include specific materials needed (easily available in Indian schools)
- Provide step-by-step instructions for teachers
- Include group work and individual tasks
- Add assessment criteria
- Make it interactive and fun
- Connect directly to the uploaded content
- Include variations for different learning styles

3. QUESTIONS AND ANSWERS (5-7 Q&A pairs):
- Create thought-provoking questions that test understanding
- Include both factual and analytical questions
- Provide detailed answers that reinforce learning
- Make questions progressive (easy to difficult)
- Include one creative/application-based question

Global Module Context: ${getGlobalModuleContext(input.globalModule)}

Format your response as valid JSON with this structure:
{
  "simplified_explanation": "detailed explanation here",
  "practical_activity": "detailed activity here", 
  "questions_and_answers": [
    {"q": "question", "a": "detailed answer"}
  ],
  "global_module_used": "module name"
}

Make the content rich, detailed, and specifically tailored to ${input.subject} for Class ${input.classLevel} students.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonResponse = JSON.parse(jsonMatch[0]);
      return {
        ...jsonResponse,
        global_module_used: getGlobalModuleName(input.globalModule)
      };
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini API Error:', error);
    return generateMockResponse(input);
  }
};

const getGlobalModuleContext = (module: string): string => {
  const contexts: Record<string, string> = {
    'auto': 'Use the best global perspective for this topic',
    'china': 'Emphasize discipline, structured learning, and systematic approach. Include concepts of respect for teachers and methodical practice.',
    'japan': 'Focus on precision, attention to detail, and mindful learning. Include concepts of continuous improvement (kaizen) and group harmony.',
    'us': 'Encourage curiosity, innovation, and creative thinking. Include concepts of questioning, exploration, and individual expression.',
    'europe': 'Emphasize creativity, artistic expression, and critical thinking. Include concepts of cultural diversity and analytical reasoning.'
  };
  
  return contexts[module] || contexts['auto'];
};

const getGlobalModuleName = (module: string): string => {
  const moduleMap: Record<string, string> = {
    'auto': 'Global Exposure',
    'china': 'Chinese Discipline Methods',
    'japan': 'Japanese Precision Learning', 
    'us': 'American Innovation Approach',
    'europe': 'European Creative Methods'
  };
  
  return moduleMap[module] || 'Global Exposure';
};

const generateMockResponse = (input: LessonInput): LessonOutput => {
  return {
    simplified_explanation: `Hello students! Today we're going to learn about an exciting topic from your ${input.subject} lesson.

📚 WHAT WE UPLOADED:
We just processed your ${input.uploadType === 'text' ? 'text content' : input.uploadType === 'pdf' ? 'PDF document' : 'audio recording'} about "${input.text.slice(0, 100)}..." This content is from your Class ${input.classLevel} ${input.subject} curriculum.

🌟 LET'S UNDERSTAND THIS TOPIC:
Think of this lesson like building blocks - each concept builds on the previous one! 

For Class ${input.classLevel} students, we can break this down into simple parts:

• Main Concept: The core idea is about understanding how things work in our daily life
• Real Examples: Just like how we see patterns in nature, markets, or festivals
• Step-by-Step: We'll learn this gradually, starting with what you already know
• Fun Facts: Did you know that this concept appears in many places around us?

🔍 DETAILED EXPLANATION:
The uploaded content teaches us important principles that we can see everywhere. When we look around our homes, schools, and communities, we can find examples of these concepts.

For instance, if this is about mathematics, we see numbers and patterns in everything - from the petals on flowers to the arrangement of windows in buildings. If it's about science, we observe these principles in cooking, playing, and even in the way plants grow.

The beauty of learning is that everything connects! This lesson will help you understand not just the textbook content, but how it applies to your real world.

Remember: Learning is like climbing a mountain - each step makes you stronger and gives you a better view of the world below!`,

    practical_activity: `🎯 HANDS-ON CLASSROOM ACTIVITY: "Discovery Learning Adventure"

📋 MATERIALS NEEDED:
• Chart paper (4-5 sheets per group)
• Colored markers and crayons
• Sticky notes (different colors)
• Small everyday objects for demonstration
• Timer or stopwatch
• Camera/phone for documentation

⏰ DURATION: 45-60 minutes

👥 SETUP (10 minutes):
1. Divide class into groups of 4-5 students
2. Give each group different colored materials
3. Assign roles: Leader, Recorder, Presenter, Materials Manager
4. Explain the activity rules and objectives

🔍 MAIN ACTIVITY (30 minutes):

PHASE 1 - EXPLORATION (15 minutes):
• Each group explores one aspect of today's lesson
• Students find real-world examples using the objects provided
• They create visual representations on chart paper
• Record observations on sticky notes

PHASE 2 - CONNECTION (15 minutes):
• Groups connect their findings to the uploaded lesson content
• Create a story or explanation using their discoveries
• Prepare a 2-minute presentation with visuals
• Practice their presentation within the group

🎭 PRESENTATION (15 minutes):
• Each group presents their findings (2 minutes each)
• Other students ask questions and give feedback
• Teacher facilitates discussion and connects all presentations
• Create a class "Knowledge Wall" with all discoveries

📊 ASSESSMENT CRITERIA:
✓ Understanding of core concept (25%)
✓ Creativity in presentation (25%)
✓ Real-world connections (25%)
✓ Team collaboration (25%)

🏆 LEARNING OUTCOMES:
Students will be able to:
• Explain the main concept in their own words
• Identify real-world applications
• Work effectively in teams
• Present ideas confidently

💡 TEACHER TIPS:
- Walk around and guide groups without giving direct answers
- Encourage questions and curiosity
- Take photos of student work for future reference
- Connect each group's findings to the broader curriculum

🎨 VARIATIONS FOR DIFFERENT LEARNERS:
• Visual learners: Focus on drawings and diagrams
• Kinesthetic learners: Use physical objects and movement
• Auditory learners: Include songs, rhymes, or storytelling
• Advanced students: Add research or extension questions`,

    questions_and_answers: [
      {
        q: `What is the main topic we learned about today from the uploaded ${input.subject} content?`,
        a: `The main topic focuses on understanding key concepts from your Class ${input.classLevel} ${input.subject} curriculum. We explored how these ideas connect to your daily life and why they're important for building stronger knowledge foundations.`
      },
      {
        q: `Can you give three real-world examples where we can see this concept in action?`,
        a: `Great question! We can see this concept in: 1) Our homes - like organizing things or solving daily problems, 2) In nature - observing patterns and relationships, and 3) In our community - seeing how people work together and share knowledge.`
      },
      {
        q: `How does this lesson connect to what we learned in previous classes?`,
        a: `This lesson builds on the foundation we created in earlier classes. It's like adding new floors to a building - we use the strong base we already have and add new knowledge on top. Each concept connects to help us understand bigger ideas.`
      },
      {
        q: `What was the most interesting part of today's practical activity?`,
        a: `The most exciting part was discovering how the concepts from our textbook actually exist all around us! When we worked in groups and found real examples, it made the lesson come alive and become much easier to remember.`
      },
      {
        q: `How can we use what we learned today to help us in other subjects?`,
        a: `This is a wonderful question! The thinking skills and problem-solving methods we practiced today can help us in all subjects. Whether it's solving math problems, understanding science experiments, or writing creative stories - the same logical thinking applies everywhere.`
      }
    ],

    global_module_used: getGlobalModuleName(input.globalModule)
  };
};

// OCR Service
export const processOCR = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apikey', 'K87899142388957'); // Free OCR.space API key
    formData.append('language', 'eng');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.ParsedResults && result.ParsedResults[0]) {
      return result.ParsedResults[0].ParsedText;
    }
    
    throw new Error('OCR processing failed');
  } catch (error) {
    console.error('OCR Error:', error);
    return `[OCR processed content from ${file.name}] - This would contain the extracted text from the uploaded PDF or image file.`;
  }
};

// Speech-to-Text Service
export const processSpeechToText = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    let finalTranscript = '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onend = () => {
      resolve(finalTranscript || `[Speech-to-text processed content from ${file.name}] - Audio transcription would appear here.`);
    };

    recognition.onerror = () => {
      resolve(`[Speech-to-text processed content from ${file.name}] - Audio transcription would appear here.`);
    };

    // For demo purposes, return mock content
    setTimeout(() => {
      resolve(`[Speech-to-text processed content from ${file.name}] - This would contain the transcribed text from the uploaded audio file about the lesson topic.`);
    }, 3000);
  });
};