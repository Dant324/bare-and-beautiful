import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { motion } from 'framer-motion';
import { Camera, ArrowLeft, RotateCcw, Check, LogOut } from 'lucide-react';

export default function CameraScreen({ onNavigate, onLogout }) {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState('Position your face in the center');

  const instructions = [
    'Position your face in the center',
    'Slowly turn your head to the left',
    'Now turn to the right',
    'Complete a full rotation',
    'Perfect! Processing your scan...'
  ];

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + 2;

          // Update instructions
          if (newProgress >= 20 && newProgress < 40) {
            setCurrentInstruction(instructions[1]);
          } else if (newProgress >= 40 && newProgress < 60) {
            setCurrentInstruction(instructions[2]);
          } else if (newProgress >= 60 && newProgress < 90) {
            setCurrentInstruction(instructions[3]);
          } else if (newProgress >= 90) {
            setCurrentInstruction(instructions[4]);
          }

          if (newProgress >= 100) {
            setIsComplete(true);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isScanning, scanProgress]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setIsComplete(false);
    setCurrentInstruction(instructions[0]);
  };

  const completeScan = () => {
    onNavigate('try-on');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('camera-prep')}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-white hover:bg-white/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Camera Preview */}
      <div className="flex-1 relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
          {/* Face Guide */}
          <motion.div
            animate={{
              scale: isScanning ? [1, 1.02, 1] : 1,
              rotate: isScanning ? [0, 2, -2, 0] : 0,
            }}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="w-64 h-80 border-4 border-white/50 rounded-full relative">
              {/* Scanning Animation */}
              {isScanning && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full"
                />
              )}

              {/* Mock Face */}
              <div className="absolute inset-4 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-full" />
              </div>

              {/* Corner Guides */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-white" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-white" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-white" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-white" />
            </div>
          </motion.div>

          {/* Scan Progress */}
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 w-80 bg-black/70 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="text-center mb-3">
                <p className="text-white text-sm">{currentInstruction}</p>
              </div>
              <Progress value={scanProgress} className="h-2 bg-white/20" />
              <div className="flex justify-between text-xs text-white/70 mt-2">
                <span>Scanning...</span>
                <span>{Math.round(scanProgress)}%</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-black/50 backdrop-blur-sm">
        <div className="flex justify-center">
          {!isScanning && !isComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <Button
                onClick={startScan}
                className="w-20 h-20 rounded-full bg-white hover:bg-gray-100 text-black shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Camera className="w-8 h-8" />
              </Button>
            </motion.div>
          )}

          {isScanning && !isComplete && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <RotateCcw className="w-8 h-8 text-white" />
            </motion.div>
          )}

          {isComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
              <Button
                onClick={completeScan}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg transition-all duration-200 hover:scale-105"
              >
                View Results
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
