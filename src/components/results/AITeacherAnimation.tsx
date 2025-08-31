import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface AITeacherAnimationProps {
  content: string;
  subject: string;
  classLevel: string;
}

export const AITeacherAnimation: React.FC<AITeacherAnimationProps> = ({ 
  content, 
  subject, 
  classLevel 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'explaining' | 'conclusion'>('intro');
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const teacherPhrases = {
    intro: `Hello my dear Class ${classLevel} students! I'm ASman, your AI teacher assistant. Today I have carefully analyzed the ${subject} content you uploaded, and I'm absolutely excited to explain every detail to you! Are you ready to discover all the amazing things hidden in your uploaded material?`,
    explaining: `Now let me explain everything about your uploaded content in complete detail! ${content.slice(0, 800)}... This is just the beginning of what we can learn from your upload. Every word, every concept, every example in your uploaded material has been carefully analyzed by me to help you understand it perfectly!`,
    conclusion: `Wonderful! We've explored every aspect of your uploaded ${subject} content together! From the specific details you provided to the real-world applications, we've covered it all. Remember, the content you uploaded today is like a treasure chest of knowledge - each concept is a precious gem that will help you in all your future learning. Keep that curiosity alive and always remember how today's upload connects to everything around you!`
  };

  const startExplanation = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setCurrentPhase('intro');
    
    const phases: Array<keyof typeof teacherPhrases> = ['intro', 'explaining', 'conclusion'];
    let currentIndex = 0;

    const speakPhase = (phase: keyof typeof teacherPhrases) => {
      if (isMuted) return;
      
      const utterance = new SpeechSynthesisUtterance(teacherPhrases[phase]);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      utterance.lang = 'en-IN';

      utterance.onstart = () => {
        setCurrentPhase(phase);
      };

      utterance.onend = () => {
        currentIndex++;
        if (currentIndex < phases.length && isPlaying) {
          setTimeout(() => speakPhase(phases[currentIndex]), 1000);
        } else {
          setIsPlaying(false);
          setCurrentPhase('intro');
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentPhase('intro');
      };

      setSpeechUtterance(utterance);
      speechSynthesis.speak(utterance);
    };

    speakPhase('intro');
  };

  const stopExplanation = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentPhase('intro');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && speechUtterance) {
      speechSynthesis.cancel();
    }
  };

  const getAnimationState = () => {
    if (!isPlaying) return 'idle';
    return currentPhase;
  };

  const getTeacherExpression = () => {
    switch (currentPhase) {
      case 'intro': return '😊';
      case 'explaining': return '🤔';
      case 'conclusion': return '🎉';
      default: return '😊';
    }
  };

  return (
    <Card>
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          >
            🤖
          </motion.div>
          <h3 className="text-lg font-semibold">ASman AI Teacher</h3>
        </div>
      </div>
      
      <div className="p-6">
        {/* AI Teacher Character */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            className="relative w-32 h-32 mb-4"
            animate={{
              scale: isPlaying ? [1, 1.05, 1] : 1,
              rotate: isPlaying ? [0, 2, -2, 0] : 0
            }}
            transition={{
              duration: 2,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* Character Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-green-200 rounded-full opacity-30"></div>
            
            {/* Character Body */}
            <motion.div
              className="absolute inset-2 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center"
              animate={{
                backgroundColor: isPlaying 
                  ? ['#fb923c', '#f97316', '#ea580c', '#fb923c']
                  : '#fb923c'
              }}
              transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }}
            >
              <span className="text-4xl">{getTeacherExpression()}</span>
            </motion.div>

            {/* Floating Elements */}
            <AnimatePresence>
              {isPlaying && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [-20, 20, -20],
                      y: [-10, -30, -10]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                    className="absolute -top-2 -left-2 text-2xl"
                  >
                    📚
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [20, -20, 20],
                      y: [-15, -35, -15]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -top-2 -right-2 text-2xl"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, 15, -15, 0],
                      y: [20, 5, 5, 20]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl"
                  >
                    🎯
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Voice Waves */}
            <AnimatePresence>
              {isPlaying && !isMuted && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 bg-blue-500 rounded-full"
                      style={{ left: i * 8 }}
                      animate={{
                        height: [4, 16, 4],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Status Text */}
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {isPlaying ? (
                currentPhase === 'intro' ? 'Analyzing Your Upload...' :
                currentPhase === 'explaining' ? 'Explaining Every Detail...' :
                'Summarizing Your Content...'
              ) : (
                'Ready to Explain Your Upload!'
              )}
            </p>
            <p className="text-sm text-gray-600">
              {isPlaying ? 'ASman is analyzing and explaining your uploaded content in complete detail' : 'Click play to hear ASman explain everything about your uploaded content'}
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={startExplanation}
            variant="primary"
            size="lg"
            className="flex items-center space-x-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start Teaching</span>
              </>
            )}
          </Button>

          <Button
            onClick={toggleMute}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>Mute</span>
              </>
            )}
          </Button>

          <Button
            onClick={stopExplanation}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Current Speech Text */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center space-x-2 mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                />
                <span className="font-semibold text-blue-800">ASman is explaining your upload:</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {teacherPhrases[currentPhase]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features List */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Complete upload analysis</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Detailed content breakdown</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>Voice explanation of upload</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span>Upload-specific teaching</span>
          </div>
        </div>
      </div>
    </Card>
  );
};