import React from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { Camera, RotateCcw, LogOut, User } from 'lucide-react';

export default function CameraPrepScreen({ onNavigate, user, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-muted-foreground">{user?.email}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-muted-foreground hover:foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Animated Avatar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotateY: [0, -15, 0] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
              className="w-48 h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-2xl"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Rotation indicators */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-400 rounded-full"
            />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mb-8 max-w-md"
        >
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Let's Create Your 3D Model
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Slowly turn your head left, right, and full circle to generate your 3D model.
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Keep your face centered in the camera</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full" />
              <span>Rotate slowly for best results</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>Ensure good lighting</span>
            </div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="w-full max-w-sm"
        >
          <Button
            onClick={() => onNavigate('camera')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 py-6"
          >
            <Camera className="w-5 h-5 mr-2" />
            Start Scan
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
