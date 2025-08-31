export const BRAND = {
  name: 'ASman Learning',
  tagline: 'Sky of Knowledge, Roots in India',
  description: 'Teacher Assistant for NCERT Lessons'
};

export const COLORS = {
  saffron: '#FF9933',
  white: '#FFFFFF',
  green: '#138808',
  blue: '#1A73E8',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

export const CLASS_LEVELS = [
  { value: '1', label: 'Class 1' },
  { value: '2', label: 'Class 2' },
  { value: '3', label: 'Class 3' },
  { value: '4', label: 'Class 4' },
  { value: '5', label: 'Class 5' }
];

export const SUBJECTS = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'environmental-studies', label: 'Environmental Studies' },
  { value: 'science', label: 'Science' },
  { value: 'social-studies', label: 'Social Studies' },
  { value: 'art-craft', label: 'Art & Craft' },
  { value: 'physical-education', label: 'Physical Education' }
];

export const GLOBAL_MODULES = [
  { 
    value: 'auto', 
    label: 'Auto Select', 
    character: '🤖', 
    flag: '🌍',
    description: 'AI will choose the best cultural perspective',
    color: 'bg-blue-500'
  },
  { 
    value: 'china', 
    label: 'China Focus', 
    character: '👨‍🏫', 
    flag: '🇨🇳',
    description: 'Discipline and structured learning approach',
    color: 'bg-red-500'
  },
  { 
    value: 'japan', 
    label: 'Japan Focus', 
    character: '👩‍🏫', 
    flag: '🇯🇵',
    description: 'Precision and mindful learning methods',
    color: 'bg-pink-500'
  },
  { 
    value: 'us', 
    label: 'US Focus', 
    character: '👨‍🎓', 
    flag: '🇺🇸',
    description: 'Curiosity-driven and innovative thinking',
    color: 'bg-blue-600'
  },
  { 
    value: 'europe', 
    label: 'Europe Focus', 
    character: '👩‍🎨', 
    flag: '🇪🇺',
    description: 'Creative and artistic learning approaches',
    color: 'bg-purple-500'
  }
];