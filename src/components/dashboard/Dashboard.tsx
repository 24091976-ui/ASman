import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../layout/Header';
import { UploadSection } from './UploadSection';
import { ResultsDisplay } from '../results/ResultsDisplay';
import { Card } from '../ui/Card';
import { BookOpen, Users, Sparkles, TrendingUp } from 'lucide-react';
import { LessonInput, LessonOutput } from '../../types';
import { generateLessonPack } from '../../services/aiService';
import toast from 'react-hot-toast';

interface DashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [lessonOutput, setLessonOutput] = useState<LessonOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentClassLevel, setCurrentClassLevel] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');

  const handleGenerate = async (input: LessonInput) => {
    setLoading(true);
    setCurrentClassLevel(input.classLevel);
    setCurrentSubject(input.subject);
    
    try {
      const output = await generateLessonPack(input);
      setLessonOutput(output);
      toast.success('Lesson pack generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate lesson pack. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: BookOpen, label: 'Lessons Created', value: '24', color: 'text-orange-600' },
    { icon: Users, label: 'Students Helped', value: '156', color: 'text-green-600' },
    { icon: Sparkles, label: 'AI Generations', value: '89', color: 'text-blue-600' },
    { icon: TrendingUp, label: 'Success Rate', value: '98%', color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!lessonOutput ? (
          <>
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Welcome back, <span className="text-orange-600">{user.name.split(' ')[0]}</span>! 👋
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your NCERT lessons into engaging, globally-aware content with AI assistance
              </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Upload Section */}
            <UploadSection onGenerate={handleGenerate} loading={loading} />
          </>
        ) : (
          <>
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <button
                onClick={() => setLessonOutput(null)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <span>← Back to Dashboard</span>
              </button>
            </motion.div>

            {/* Results */}
            <ResultsDisplay 
              output={lessonOutput} 
              classLevel={currentClassLevel}
              subject={currentSubject}
            />
          </>
        )}
      </main>
    </div>
  );
};