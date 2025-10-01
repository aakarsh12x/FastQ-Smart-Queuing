'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Crown, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QueuePosition {
  position: number;
  total: number;
  isMoving?: boolean;
}

interface QueueAnimationProps {
  userPosition: number;
  totalPeople: number;
  estimatedWaitTime?: string;
  queueName?: string;
}

export function QueueAnimation({ 
  userPosition, 
  totalPeople, 
  estimatedWaitTime,
  queueName 
}: QueueAnimationProps) {
  const [displayPosition, setDisplayPosition] = useState(userPosition);
  const [isAnimating, setIsAnimating] = useState(false);

  // Smooth position change animation
  useEffect(() => {
    if (userPosition !== displayPosition) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayPosition(userPosition);
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [userPosition, displayPosition]);

  // Calculate visible people (show 3 ahead + user + 2 behind)
  const visibleRange = 6;
  const peopleAhead = Math.min(displayPosition - 1, 3);
  const peopleBehind = Math.min(totalPeople - displayPosition, 2);
  
  const visiblePeople = [];
  for (let i = displayPosition - peopleAhead; i <= displayPosition + peopleBehind; i++) {
    if (i > 0 && i <= totalPeople) {
      visiblePeople.push(i);
    }
  }

  const getPersonColor = (position: number) => {
    if (position === displayPosition) {
      return {
        bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        border: 'border-blue-400',
        glow: 'shadow-blue-500/50',
      };
    } else if (position === 1) {
      return {
        bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        border: 'border-yellow-400',
        glow: 'shadow-yellow-500/30',
      };
    } else if (position < displayPosition) {
      return {
        bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        border: 'border-emerald-400',
        glow: 'shadow-emerald-500/20',
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-gray-600 to-gray-700',
        border: 'border-gray-500',
        glow: 'shadow-gray-500/10',
      };
    }
  };

  return (
    <div className="relative w-full p-8 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-xy"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-white">
            {queueName || 'Your Queue Position'}
          </h3>
          {isAnimating && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30"
            >
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Moving up!</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <span className="text-sm">
            <span className="font-semibold text-white">{displayPosition - 1}</span> people ahead
          </span>
          {estimatedWaitTime && (
            <>
              <span>•</span>
              <span className="text-sm">
                ~<span className="font-semibold text-white">{estimatedWaitTime}</span> wait
              </span>
            </>
          )}
        </div>
      </div>

      {/* Queue Visualization */}
      <div className="relative z-10 flex flex-col items-center gap-3 min-h-[400px]">
        {/* Direction indicator */}
        <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-gray-600"></div>
          <span>Front of Queue</span>
          <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-gray-600"></div>
        </div>

        {/* People in queue */}
        <AnimatePresence mode="popLayout">
          {visiblePeople.map((position, index) => {
            const isUser = position === displayPosition;
            const isFirst = position === 1;
            const colors = getPersonColor(position);
            
            return (
              <motion.div
                key={position}
                layout
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  scale: isUser ? 1.1 : 1,
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.05,
                }}
                className="relative"
              >
                {/* Connection line */}
                {index > 0 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gradient-to-b from-gray-700 to-transparent"
                  />
                )}

                {/* Person card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`
                    relative flex items-center gap-4 px-6 py-4 rounded-xl border-2
                    ${colors.bg} ${colors.border}
                    ${isUser ? 'shadow-2xl ring-4 ring-blue-500/20 ' + colors.glow : 'shadow-lg ' + colors.glow}
                    transition-all duration-300
                    ${isUser ? 'min-w-[300px]' : 'min-w-[280px]'}
                  `}
                >
                  {/* Crown icon for first person */}
                  {isFirst && (
                    <motion.div
                      initial={{ rotate: -45, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="absolute -top-3 -right-3"
                    >
                      <div className="p-2 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50">
                        <Crown className="w-4 h-4 text-yellow-900" />
                      </div>
                    </motion.div>
                  )}

                  {/* Avatar */}
                  <motion.div
                    animate={isUser ? { 
                      boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 10px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)']
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-full
                      ${isUser ? 'bg-white/20' : 'bg-white/10'}
                      backdrop-blur-sm
                    `}
                  >
                    <User className={`w-6 h-6 ${isUser ? 'text-white' : 'text-white/70'}`} />
                  </motion.div>

                  {/* Position info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${isUser ? 'text-white' : 'text-white/80'}`}>
                        {isUser ? 'You' : isFirst ? 'Being Served' : `Person ${position}`}
                      </span>
                      {isUser && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </div>
                    <div className={`text-xs ${isUser ? 'text-blue-200' : 'text-white/60'}`}>
                      Position #{position}
                    </div>
                  </div>

                  {/* Position badge */}
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${isUser ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'}
                  `}>
                    #{position}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* More people indicator */}
        {displayPosition + peopleBehind < totalPeople && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2 mt-4"
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs text-gray-500">
              +{totalPeople - (displayPosition + peopleBehind)} more behind
            </span>
          </motion.div>
        )}
      </div>

      {/* Stats footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-8 grid grid-cols-3 gap-4"
      >
        <div className="text-center p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
          <div className="text-2xl font-bold text-blue-400">{displayPosition}</div>
          <div className="text-xs text-gray-400 mt-1">Your Position</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
          <div className="text-2xl font-bold text-emerald-400">{displayPosition - 1}</div>
          <div className="text-xs text-gray-400 mt-1">Ahead of You</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
          <div className="text-2xl font-bold text-purple-400">{totalPeople}</div>
          <div className="text-xs text-gray-400 mt-1">Total in Queue</div>
        </div>
      </motion.div>
    </div>
  );
}

// Add to globals.css for gradient animation
// @keyframes gradient-xy {
//   0%, 100% { background-position: 0% 0%; }
//   50% { background-position: 100% 100%; }
// }

