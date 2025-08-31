import React from 'react';
import { motion } from 'framer-motion';
import { LessonCard } from './LessonCard';
import { QACard } from './QACard';
import { GlobalModuleCard } from './GlobalModuleCard';
import { AITeacherAnimation } from './AITeacherAnimation';
import { ExportSection } from './ExportSection';
import { BookOpen, Activity, Globe } from 'lucide-react';
import { LessonOutput } from '../../types';

interface ResultsDisplayProps {
  output: LessonOutput;
  classLevel: string;
  subject: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  output, 
  classLevel,
  subject
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Lesson Pack is Ready! ✨
        </h2>
        <p className="text-gray-600">
          AI-generated content tailored for Class {classLevel}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <LessonCard
            title="Simplified Lesson"
            content={output.simplified_explanation}
            icon={<BookOpen className="w-6 h-6" />}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <LessonCard
            title="Practical Activity"
            content={output.practical_activity}
            icon={<Activity className="w-6 h-6" />}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <QACard questions={output.questions_and_answers} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlobalModuleCard
          moduleName={output.global_module_used}
          content={`This lesson incorporates ${output.global_module_used} learning methodologies to provide students with a global perspective while maintaining strong Indian educational values.`}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <AITeacherAnimation 
          content={output.simplified_explanation} 
          subject={subject}
          classLevel={classLevel}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ExportSection lessonOutput={output} classLevel={classLevel} />
      </motion.div>
    </motion.div>
  );
};