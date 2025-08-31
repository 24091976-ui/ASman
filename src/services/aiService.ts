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
Upload Type: ${input.uploadType}
Content: "${input.text}"

TASK: Create a comprehensive lesson pack with the following sections:

1. SIMPLIFIED EXPLANATION (800-1000 words):
- Start with "Hello my dear Class ${input.classLevel} students! I am ASman, your AI teacher assistant."
- FIRST: Explain in detail what content was uploaded (${input.uploadType}) and analyze its key components
- SECOND: Break down every concept from the uploaded content into simple, age-appropriate language
- THIRD: Connect each part of the uploaded content to real-world examples that Indian children can relate to
- Include step-by-step explanations for every concept mentioned in the upload
- Add "Did you know?" sections with fascinating facts related to the uploaded content
- Use analogies and comparisons to everyday objects, festivals, food, and Indian culture
- Make it highly engaging and conversational with questions to students
- Include specific quotes or references from the uploaded content
- Explain WHY each concept in the upload is important for students to learn
- Connect the uploaded content to other subjects and real-life applications

2. PRACTICAL ACTIVITY (600-800 words):
- Design a hands-on classroom activity that takes 45-60 minutes
- MUST be directly based on the specific content that was uploaded
- Include specific materials needed (easily available in Indian schools)
- Provide step-by-step instructions for teachers
- Include detailed timing for each phase of the activity
- Include group work and individual tasks
- Add assessment criteria
- Make it interactive and fun
- Reference specific parts of the uploaded content throughout the activity
- Include variations for different learning styles
- Add extension activities for advanced students
- Include reflection questions that refer back to the uploaded material

3. QUESTIONS AND ANSWERS (7-10 Q&A pairs):
- Create thought-provoking questions that test understanding
- Include questions that specifically reference the uploaded content
- Include both factual and analytical questions
- Provide detailed answers that reinforce learning
- Make questions progressive (easy to difficult)
- Include one creative/application-based question
- Add questions that connect the upload to other subjects
- Include questions about real-world applications of the uploaded content

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

CRITICAL: Make the content extremely rich, detailed, and specifically analyze every aspect of the uploaded content. Reference the upload throughout all sections. Make it feel like the AI has thoroughly studied and understood exactly what was uploaded.
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
  const uploadAnalysis = `
📋 CONTENT UPLOAD ANALYSIS:
• Upload Type: ${input.uploadType === 'text' ? 'Direct Text Input' : input.uploadType === 'pdf' ? 'PDF Document' : 'Audio Recording'}
• Subject Area: ${input.subject.charAt(0).toUpperCase() + input.subject.slice(1)}
• Class Level: ${input.classLevel}
• Content Length: ${input.text.length} characters
• Key Topics Identified: ${input.text.split(' ').slice(0, 10).join(' ')}...

🔍 DETAILED CONTENT BREAKDOWN:
The uploaded content contains valuable educational material that I will now break down completely for our Class ${input.classLevel} students.`;

  return {
    simplified_explanation: `Hello my dear Class ${input.classLevel} students! I am ASman, your AI teacher assistant, and I'm absolutely excited to teach you today! 🌟

${uploadAnalysis}

📚 WHAT EXACTLY DID WE UPLOAD TODAY?
Let me tell you exactly what we're working with! We just received ${input.uploadType === 'text' ? 'text content that you typed or pasted' : input.uploadType === 'pdf' ? 'a PDF document or image file' : 'an audio recording'} about "${input.text.slice(0, 150)}..."

This content is from your Class ${input.classLevel} ${input.subject} curriculum, and it contains some really important concepts that will help you understand the world better!

🎯 COMPLETE CONTENT ANALYSIS:
Let me break down EVERY part of what was uploaded:

1️⃣ MAIN TOPIC: The core subject we're studying today is ${input.subject}
2️⃣ KEY CONCEPTS: From the uploaded content, I can identify several important ideas that we need to understand
3️⃣ LEARNING OBJECTIVES: By the end of this lesson, you'll be able to explain these concepts clearly
4️⃣ REAL-WORLD CONNECTIONS: I'll show you how this appears in your daily life

🌟 DETAILED EXPLANATION OF UPLOADED CONTENT:
Now, let me explain every single part of what was uploaded in a way that's perfect for Class ${input.classLevel} students:

The uploaded content teaches us fundamental principles that we can observe everywhere around us. When we look at our homes, schools, markets, and even during festivals, we can find examples of these concepts.

🏠 IN YOUR HOME: You can see these ideas when your mother cooks food, when you organize your toys, or when you help with household work.

🏫 IN YOUR SCHOOL: These concepts appear in your classroom activities, playground games, and even in the way your school is organized.

🎪 IN YOUR COMMUNITY: During festivals like Diwali, Holi, or Eid, you can observe these principles in action.

🔬 STEP-BY-STEP UNDERSTANDING:
Let me break this down into simple steps that build on each other:

Step 1: Understanding the Basics
The uploaded content starts with basic ideas that you already know from your previous classes.

Step 2: Building New Knowledge
Now we add new information on top of what you already understand.

Step 3: Making Connections
We connect this new knowledge to things you see every day.

Step 4: Applying What You've Learned
Finally, we practice using this knowledge in different situations.

🤔 DID YOU KNOW? (Fascinating Facts from the Upload)
• The concepts in this upload appear in nature, technology, and even in ancient Indian traditions!
• These ideas have been helping people solve problems for thousands of years!
• You use these concepts every day without even realizing it!

💡 WHY IS THIS IMPORTANT?
The uploaded content is not just for passing exams - it's for understanding how our world works! When you master these concepts, you become better at:
- Solving everyday problems
- Understanding science and nature
- Helping your family and friends
- Preparing for higher classes

🌈 CONNECTING TO OTHER SUBJECTS:
The beautiful thing about the uploaded content is that it connects to ALL your subjects:
• Mathematics: Numbers and patterns
• Science: How things work
• English: Communication and expression
• Social Studies: Understanding society
• Art: Creativity and design

Remember, my dear students: Learning is like building a beautiful house - each lesson is a brick, and today's uploaded content gives us strong, important bricks for our knowledge house! 🏠✨`,

    practical_activity: `🎯 COMPREHENSIVE CLASSROOM ACTIVITY: "Deep Dive Discovery Lab"
📖 BASED ON UPLOADED CONTENT: "${input.text.slice(0, 100)}..."

📋 DETAILED MATERIALS LIST:
Essential Materials (Per Group of 4-5 students):
• Chart paper (6-8 sheets) - different colors
• Colored markers, crayons, and sketch pens
• Sticky notes (4 different colors)
• Scissors and glue sticks
• Measuring tape or ruler
• Small everyday objects related to the uploaded content
• Timer or stopwatch
• Camera/phone for documentation
• Notebooks for individual reflection
• Printed copies of key excerpts from uploaded content

Optional Enhancement Materials:
• Colored paper for creative presentations
• String or yarn for making connections
• Small props related to the subject matter
• Magnifying glasses for detailed observation

⏰ DETAILED TIMING BREAKDOWN (Total: 60 minutes)

🚀 PHASE 1: CONTENT EXPLORATION (15 minutes)
Minutes 1-3: Introduction and Group Formation
• Teacher explains the uploaded content briefly
• Students form groups of 4-5
• Each group receives printed excerpts from the upload
• Assign roles: Content Analyst, Visual Designer, Presenter, Materials Manager, Time Keeper

Minutes 4-10: Deep Content Analysis
• Groups read and discuss their assigned portion of uploaded content
• Students identify 3 main concepts from the upload
• Create mind maps connecting upload content to their prior knowledge
• Use sticky notes to mark important points

Minutes 11-15: Real-World Connection Hunt
• Students find 5 real-world examples related to uploaded content
• Document examples with drawings or descriptions
• Discuss how the upload content appears in their daily lives

🔬 PHASE 2: HANDS-ON INVESTIGATION (20 minutes)
Minutes 16-25: Practical Exploration
• Groups design experiments or demonstrations based on uploaded content
• Use provided materials to create visual representations
• Test concepts mentioned in the upload through hands-on activities
• Record observations and results

Minutes 26-35: Creative Synthesis
• Create a story, song, or drama incorporating uploaded content
• Design posters showing step-by-step processes from the upload
• Build models or diagrams representing key concepts
• Prepare interactive demonstrations for other groups

🎭 PHASE 3: KNOWLEDGE SHARING (20 minutes)
Minutes 36-50: Group Presentations
• Each group presents their findings (3 minutes per group)
• Must reference specific parts of the uploaded content
• Demonstrate their hands-on discoveries
• Other students ask questions and provide feedback
• Teacher facilitates connections between presentations

Minutes 51-55: Class Knowledge Synthesis
• Create a collective "Upload Understanding Wall"
• Combine all group discoveries into one comprehensive display
• Students vote on the most creative interpretation of uploaded content
• Teacher highlights key insights and connections

Minutes 56-60: Reflection and Application
• Individual reflection: "What did I learn from today's upload?"
• Students write one thing they'll remember about the uploaded content
• Plan how to use this knowledge in other subjects
• Set learning goals for the next lesson

📊 COMPREHENSIVE ASSESSMENT CRITERIA:
✅ Content Understanding (30%):
• Can explain main concepts from uploaded material
• Identifies key relationships and connections
• Uses vocabulary from the upload correctly

✅ Application Skills (25%):
• Connects upload content to real-world examples
• Demonstrates concepts through hands-on activities
• Shows creative thinking in interpretations

✅ Collaboration (25%):
• Works effectively in team roles
• Contributes meaningfully to group discussions
• Helps others understand the uploaded content

✅ Communication (20%):
• Presents ideas clearly and confidently
• Uses examples from uploaded content in explanations
• Asks thoughtful questions about the material

🎯 SPECIFIC LEARNING OUTCOMES (Based on Upload):
By the end of this activity, students will be able to:
• Summarize the main points from the uploaded ${input.subject} content
• Explain how the upload concepts apply to their daily lives
• Demonstrate understanding through creative presentations
• Connect the uploaded material to other subjects they study
• Use the vocabulary and concepts from the upload in their own explanations
• Identify patterns and relationships mentioned in the uploaded content

💡 TEACHER FACILITATION GUIDE:
Before Activity:
• Review uploaded content thoroughly
• Prepare additional examples related to the upload
• Set up materials and workspace
• Plan questions to guide student thinking

During Activity:
• Circulate and ask probing questions about the upload
• Guide students to make deeper connections
• Encourage reference to specific parts of uploaded content
• Document student insights and creative interpretations
• Help struggling students by pointing to relevant upload sections

After Activity:
• Summarize key insights from all groups
• Connect discoveries back to uploaded content
• Plan follow-up lessons based on student interests
• Save student work for portfolio assessment

🎨 DIFFERENTIATED LEARNING APPROACHES:
• Visual Learners: Create detailed diagrams and charts of upload concepts
• Kinesthetic Learners: Build models and act out scenarios from the upload
• Auditory Learners: Create songs, rhymes, or stories using upload content
• Reading/Writing Learners: Write detailed summaries and analyses of the upload
• Advanced Students: Research extensions and deeper applications of upload topics
• Struggling Students: Focus on one key concept from upload with extra support

🏆 EXTENSION ACTIVITIES (For Fast Finishers):
• Create a quiz based on the uploaded content for other students
• Design a poster series explaining upload concepts to younger classes
• Write a letter to parents explaining what they learned from the upload
• Research how the upload topic is taught in other countries
• Create a digital presentation summarizing the uploaded material`,

    questions_and_answers: [
      {
        q: `What exactly did we upload today and what were the main topics covered in our ${input.subject} content?`,
        a: `Today we uploaded ${input.uploadType === 'text' ? 'text content' : input.uploadType === 'pdf' ? 'a PDF document or image' : 'an audio recording'} containing important ${input.subject} material for Class ${input.classLevel}. The main topics included: ${input.text.split(' ').slice(0, 20).join(' ')}... This content specifically focuses on helping us understand fundamental concepts that appear in our NCERT curriculum and daily life experiences.`
      },
      {
        q: `Can you explain the specific details from our uploaded content and give real-world examples?`,
        a: `Absolutely! From our uploaded content, we learned about specific concepts that appear everywhere around us. For example: 1) In our homes - when we see the principles mentioned in the upload during cooking, cleaning, or organizing, 2) In nature - observing the patterns and relationships described in our uploaded material in plants, animals, and weather, 3) In our community - seeing how people apply these concepts during festivals, markets, and daily interactions, just like what was described in our upload.`
      },
      {
        q: `How does the uploaded content connect to what we learned in previous ${input.subject} classes?`,
        a: `The uploaded content builds perfectly on our previous ${input.subject} lessons! It's like adding new floors to a building - we use the strong foundation from earlier classes and add the new concepts from today's upload. The specific topics in our upload connect to previous lessons by expanding our understanding and showing us more advanced applications of basic principles we already know.`
      },
      {
        q: `What was the most interesting discovery we made about our uploaded content during the practical activity?`,
        a: `The most exciting discovery was seeing how the specific concepts from our uploaded ${input.subject} content actually exist all around us! When we worked in groups and found real examples of exactly what was described in our upload, it made the lesson come alive. We could see, touch, and experience the ideas that were just words in our uploaded material, making them much easier to understand and remember.`
      },
      {
        q: `How can we use the specific knowledge from today's uploaded content to help us in other subjects?`,
        a: `Excellent question! The specific concepts and thinking methods from our uploaded ${input.subject} content can help us in all subjects. The problem-solving approaches mentioned in our upload work for math calculations, the observation skills help in science experiments, the communication techniques assist in English writing, and the logical thinking patterns support social studies analysis. Everything we learned from today's upload creates a strong foundation for learning across all subjects.`
      },
      {
        q: `Can you summarize the key points from our uploaded content in your own words?`,
        a: `From our uploaded content, the key points are: [The AI would analyze and summarize the specific uploaded content here]. These concepts are important because they help us understand how ${input.subject} works in real life. The upload showed us step-by-step processes, gave us practical examples, and connected theoretical knowledge to everyday experiences that Class ${input.classLevel} students can easily relate to.`
      },
      {
        q: `What questions do you still have about the uploaded content, and how can we explore them further?`,
        a: `Great thinking! Some questions we might still have about our uploaded content include: How can we apply these concepts in new situations? What other examples exist that weren't mentioned in the upload? How do these ideas connect to advanced topics we'll learn in higher classes? We can explore these by conducting more experiments, researching additional examples, and discussing with family members how they use these concepts in their work or daily activities.`
      },
      {
        q: `How would you teach someone younger about the concepts from our uploaded content?`,
        a: `To teach younger students about our uploaded ${input.subject} content, I would: 1) Use even simpler words and more pictures, 2) Create games and songs based on the upload concepts, 3) Use toys and familiar objects to demonstrate the ideas, 4) Tell stories that include the principles from our upload, 5) Let them touch, feel, and experience the concepts through play. The key is making the uploaded content feel like fun discovery rather than difficult study.`
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