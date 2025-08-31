import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Upload, FileText, Mic, Sparkles } from 'lucide-react';
import { CLASS_LEVELS, GLOBAL_MODULES, SUBJECTS } from '../../config/constants';
import { LessonInput } from '../../types';

interface UploadSectionProps {
  onGenerate: (input: LessonInput) => Promise<void>;
  loading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onGenerate, loading }) => {
  const [uploadType, setUploadType] = useState<'text' | 'pdf' | 'audio'>('text');
  const [text, setText] = useState('');
  const [classLevel, setClassLevel] = useState('3');
  const [subject, setSubject] = useState('mathematics');
  const [globalModule, setGlobalModule] = useState('auto');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    onDrop: (files) => {
      const file = files[0];
      if (file) {
        if (file.type.includes('pdf') || file.type.includes('image')) {
          setUploadType('pdf');
        } else if (file.type.includes('audio')) {
          setUploadType('audio');
        }
        // In a real app, you'd process the file here
        setText(`[${file.name} uploaded - processing would happen here]`);
      }
    }
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    await onGenerate({
      text,
      classLevel,
      subject,
      globalModule,
      uploadType
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Upload className="w-6 h-6 mr-3 text-orange-500" />
          Upload NCERT Content
        </h2>

        {/* Upload Type Selector */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { type: 'text', icon: FileText, label: 'Paste Text' },
            { type: 'pdf', icon: Upload, label: 'Upload PDF/Image' },
            { type: 'audio', icon: Mic, label: 'Upload Audio' }
          ].map(({ type, icon: Icon, label }) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUploadType(type as any)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                uploadType === type
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content Input */}
        {uploadType === 'text' ? (
          <Textarea
            label="NCERT Lesson Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your NCERT lesson content here..."
            rows={8}
          />
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop your file here' : `Upload ${uploadType === 'pdf' ? 'PDF or Image' : 'Audio'} file`}
            </p>
            <p className="text-sm text-gray-500">
              {uploadType === 'pdf' 
                ? 'Supports PDF, PNG, JPG files' 
                : 'Supports MP3, WAV, M4A files'
              }
            </p>
          </div>
        )}

        {text && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Content Preview:</p>
            <p className="text-sm text-gray-800 line-clamp-3">{text}</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <Select
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            options={SUBJECTS}
          />
        </Card>

        <Card className="p-6">
          <Select
            label="Class Level"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            options={CLASS_LEVELS}
          />
        </Card>

        <Card className="p-6">
          <Select
            label="Global Learning Module"
            value={globalModule}
            onChange={(e) => setGlobalModule(e.target.value)}
            options={GLOBAL_MODULES.map(m => ({ value: m.value, label: m.label }))}
          />
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {GLOBAL_MODULES.find(m => m.value === globalModule)?.description}
            </p>
          </div>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={handleGenerate}
          size="lg"
          loading={loading}
          disabled={!text.trim()}
          className="px-12 py-4 text-xl"
        >
          <Sparkles className="w-6 h-6 mr-3" />
          Generate Lesson Pack
        </Button>
      </div>
    </div>
  );
};