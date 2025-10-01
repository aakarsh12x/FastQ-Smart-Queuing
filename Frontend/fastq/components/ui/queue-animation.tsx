'use client';

import { motion } from 'framer-motion';
import { User, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';

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

  // Simple position update without complex animations
  useEffect(() => {
    setDisplayPosition(userPosition);
  }, [userPosition]);

  // Calculate visible people (show 5 ahead + user + 3 behind for horizontal layout)
  const peopleAhead = Math.min(displayPosition - 1, 5);
  const peopleBehind = Math.min(totalPeople - displayPosition, 3);
  
  const visiblePeople = [];
  for (let i = displayPosition - peopleAhead; i <= displayPosition + peopleBehind; i++) {
    if (i > 0 && i <= totalPeople) {
      visiblePeople.push(i);
    }
  }

  const getPersonColor = (position: number) => {
    if (position === displayPosition) {
      return {
        bg: 'bg-blue-600',
        border: 'border-blue-400',
        text: 'text-white',
      };
    } else if (position === 1) {
      return {
        bg: 'bg-yellow-500',
        border: 'border-yellow-400',
        text: 'text-yellow-900',
      };
    } else if (position < displayPosition) {
      return {
        bg: 'bg-emerald-500',
        border: 'border-emerald-400',
        text: 'text-white',
      };
    } else {
      return {
        bg: 'bg-gray-600',
        border: 'border-gray-500',
        text: 'text-gray-200',
      };
    }
  };

  return (
    <div className="relative w-full p-6 rounded-xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">
            {queueName || 'Queue Position'}
          </h3>
          <div className="text-sm text-gray-400">
            {estimatedWaitTime && `~${estimatedWaitTime} wait`}
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <span className="font-medium text-white">{displayPosition - 1}</span> people ahead of you
        </div>
      </div>

      {/* Horizontal Queue Visualization */}
      <div className="relative">
        {/* Direction indicator */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Front of Queue</span>
          <span>Back of Queue</span>
        </div>

        {/* People in queue - Horizontal layout */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-4 px-2">
          {visiblePeople.map((position, index) => {
            const isUser = position === displayPosition;
            const isFirst = position === 1;
            const colors = getPersonColor(position);
            
            return (
              <div
                key={position}
                className="relative flex-shrink-0"
              >
                {/* Connection line */}
                {index > 0 && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-gray-600" />
                )}

                {/* Person card */}
                <div
                  className={`
                    relative flex flex-col items-center gap-2 p-3 rounded-lg border
                    ${colors.bg} ${colors.border} ${colors.text}
                    ${isUser ? 'ring-2 ring-blue-400/50' : ''}
                    transition-all duration-500 ease-out
                    hover:scale-110 hover:shadow-xl hover:shadow-black/30 hover:z-10
                    cursor-pointer
                    min-w-[80px]
                  `}
                >
                  {/* Crown icon for first person */}
                  {isFirst && (
                    <div className="absolute -top-2 -right-2">
                      <div className="p-1 rounded-full bg-yellow-400">
                        <Crown className="w-3 h-3 text-yellow-900" />
                      </div>
                    </div>
                  )}

                  {/* Avatar */}
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full
                    ${isUser ? 'bg-white/20' : 'bg-white/10'}
                  `}>
                    <User className="w-4 h-4" />
                  </div>

                  {/* Position info */}
                  <div className="text-center">
                    <div className="text-xs font-medium">
                      {isUser ? 'You' : isFirst ? 'Serving' : `#${position}`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* More people indicator */}
        {displayPosition + peopleBehind < totalPeople && (
          <div className="text-center mt-4">
            <span className="text-xs text-gray-500">
              +{totalPeople - (displayPosition + peopleBehind)} more behind
            </span>
          </div>
        )}
      </div>

      {/* Simple stats footer */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
          <div className="text-xl font-bold text-blue-400">{displayPosition}</div>
          <div className="text-xs text-gray-400 mt-1">Your Position</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
          <div className="text-xl font-bold text-emerald-400">{displayPosition - 1}</div>
          <div className="text-xs text-gray-400 mt-1">Ahead</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
          <div className="text-xl font-bold text-purple-400">{totalPeople}</div>
          <div className="text-xs text-gray-400 mt-1">Total</div>
        </div>
      </div>
    </div>
  );
}

// Add to globals.css for gradient animation
// @keyframes gradient-xy {
//   0%, 100% { background-position: 0% 0%; }
//   50% { background-position: 100% 100%; }
// }

