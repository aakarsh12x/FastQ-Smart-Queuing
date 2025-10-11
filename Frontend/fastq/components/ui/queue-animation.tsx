'use client';

import { motion } from 'framer-motion';
import { User, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QueueData {
  userPosition: number;
  totalPeople: number;
  estimatedWaitTime?: string;
  queueName?: string;
  queueId: string;
}

interface QueueAnimationProps {
  queues: QueueData[];
}

export function QueueAnimation({ queues }: QueueAnimationProps) {
  if (!queues || queues.length === 0) {
    return (
      <div className="relative w-full p-4 rounded-xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="text-center text-gray-400 py-8">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active queues</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {queues.map((queue) => (
        <SingleQueueAnimation key={queue.queueId} queue={queue} />
      ))}
    </div>
  );
}

function SingleQueueAnimation({ queue }: { queue: QueueData }) {
  const [displayPosition, setDisplayPosition] = useState(queue.userPosition);

  // Simple position update without complex animations
  useEffect(() => {
    setDisplayPosition(queue.userPosition);
  }, [queue.userPosition]);

  // Calculate visible people (show 3 ahead + user + 2 behind for compact layout)
  const peopleAhead = Math.min(displayPosition - 1, 3);
  const peopleBehind = Math.min(queue.totalPeople - displayPosition, 2);

  type QueueItem = { position: number; isPlaceholder: boolean };
  const visiblePeople: QueueItem[] = [];
  const placeholderBlocks: QueueItem[] = [];
  
  // Add real people
  for (let i = displayPosition - peopleAhead; i <= displayPosition + peopleBehind; i++) {
    if (i > 0 && i <= queue.totalPeople) {
      visiblePeople.push({ position: i, isPlaceholder: false });
    }
  }
  
  // Add grey placeholder blocks if there are no people behind
  if (peopleBehind === 0) {
    for (let i = 1; i <= 2; i++) {
      placeholderBlocks.push({ position: displayPosition + i, isPlaceholder: true });
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
    <div className="relative w-full p-4 rounded-lg border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
      {/* Compact Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-white">
            {queue.queueName || 'Queue Position'}
          </h3>
          <div className="text-xs text-gray-400">
            {queue.estimatedWaitTime && `~${queue.estimatedWaitTime}`}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          <span className="font-medium text-white">{displayPosition - 1}</span> ahead
        </div>
      </div>

      {/* Compact Horizontal Queue Visualization */}
      <div className="relative">
        {/* People in queue - Compact horizontal layout */}
        <div className="flex items-center justify-center gap-1 overflow-x-auto py-2 px-1">
          {[...visiblePeople, ...placeholderBlocks].map((item, index) => {
            const position = item.position;
            const isPlaceholder = item.isPlaceholder;
            const isUser = position === displayPosition;
            const isFirst = position === 1;
            const colors = isPlaceholder ? {
              bg: 'bg-gray-700',
              border: 'border-gray-600',
              text: 'text-gray-400'
            } : getPersonColor(position);
            
            return (
              <div
                key={`${position}-${isPlaceholder ? 'placeholder' : 'real'}`}
                className="relative flex-shrink-0"
              >
                {/* Connection line */}
                {index > 0 && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-gray-600" />
                )}

                {/* Compact Person card */}
                <div
                  className={`
                    relative flex flex-col items-center gap-1 p-2 rounded-md border
                    ${colors.bg} ${colors.border} ${colors.text}
                    ${isUser ? 'ring-1 ring-blue-400/50' : ''}
                    ${isPlaceholder ? 'opacity-50' : ''}
                    transition-colors duration-200
                    ${!isPlaceholder ? 'hover:opacity-80 cursor-pointer' : ''}
                    min-w-[50px]
                  `}
                >
                  {/* Crown icon for first person */}
                  {isFirst && !isPlaceholder && (
                    <div className="absolute -top-1 -right-1">
                      <div className="p-0.5 rounded-full bg-yellow-400">
                        <Crown className="w-2 h-2 text-yellow-900" />
                      </div>
                    </div>
                  )}

                  {/* Compact Avatar */}
                  <div className={`
                    flex items-center justify-center w-5 h-5 rounded-full
                    ${isUser ? 'bg-white/20' : isPlaceholder ? 'bg-gray-600/30' : 'bg-white/10'}
                  `}>
                    <User className="w-3 h-3" />
                  </div>

                  {/* Position info */}
                  <div className="text-center">
                    <div className="text-xs font-medium">
                      {isUser ? 'You' : isFirst && !isPlaceholder ? 'Now' : isPlaceholder ? '—' : position}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* More people indicator */}
        {displayPosition + peopleBehind < queue.totalPeople && (
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500">
              +{queue.totalPeople - (displayPosition + peopleBehind)} more
            </span>
          </div>
        )}
      </div>

      {/* Compact stats footer */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded-md bg-gray-800/30 border border-gray-700/30">
          <div className="text-sm font-bold text-blue-400">{displayPosition}</div>
          <div className="text-xs text-gray-400">Position</div>
        </div>
        <div className="text-center p-2 rounded-md bg-gray-800/30 border border-gray-700/30">
          <div className="text-sm font-bold text-emerald-400">{displayPosition - 1}</div>
          <div className="text-xs text-gray-400">Ahead</div>
        </div>
        <div className="text-center p-2 rounded-md bg-gray-800/30 border border-gray-700/30">
          <div className="text-sm font-bold text-purple-400">{queue.totalPeople}</div>
          <div className="text-xs text-gray-400">Total</div>
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

