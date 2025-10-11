'use client';

/**
 * QueueAnimation Component - Usage Example
 * 
 * This file demonstrates how to use the QueueAnimation component
 * in your user dashboard or queue status pages.
 */

import { QueueAnimation } from './queue-animation';
import { useState, useEffect } from 'react';

export function QueueAnimationDemo() {
  // Example: Fetch queue data from your backend
  const [queueData, setQueueData] = useState({
    userPosition: 5,
    totalPeople: 15,
    estimatedWaitTime: '12 min',
    queueName: 'Main Canteen'
  });

  // Simulate real-time position updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueData(prev => {
        if (prev.userPosition > 1) {
          return {
            ...prev,
            userPosition: prev.userPosition - 1,
            estimatedWaitTime: `${(prev.userPosition - 1) * 2.5} min`
          };
        }
        return prev;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Queue Animation Demo</h1>
      
      <QueueAnimation
        queues={[{
          queueId: 'demo-queue',
          userPosition: queueData.userPosition,
          totalPeople: queueData.totalPeople,
          estimatedWaitTime: queueData.estimatedWaitTime,
          queueName: queueData.queueName
        }]}
      />
    </div>
  );
}

/**
 * Integration Example in User Dashboard:
 * 
 * // In your user-dashboard/page.tsx or queue status page:
 * 
 * import { QueueAnimation } from '@/components/ui/queue-animation';
 * 
 * export default function QueueStatusPage() {
 *   const [queueStatus, setQueueStatus] = useState(null);
 * 
 *   useEffect(() => {
 *     // Fetch from your backend API
 *     const fetchQueueStatus = async () => {
 *       const token = localStorage.getItem('token');
 *       const res = await fetch(`${API_URL}/queues/my-position`, {
 *         headers: { Authorization: `Bearer ${token}` }
 *       });
 *       const data = await res.json();
 *       setQueueStatus(data);
 *     };
 * 
 *     fetchQueueStatus();
 *     // Set up Socket.IO for real-time updates
 *     const socket = io(API_URL);
 *     socket.on('position-update', (data) => {
 *       setQueueStatus(data);
 *     });
 * 
 *     return () => socket.disconnect();
 *   }, []);
 * 
 *   if (!queueStatus) return <div>Loading...</div>;
 * 
 *   return (
 *     <QueueAnimation
 *       userPosition={queueStatus.position}
 *       totalPeople={queueStatus.queueLength}
 *       estimatedWaitTime={queueStatus.estimatedWaitTime}
 *       queueName={queueStatus.queueName}
 *     />
 *   );
 * }
 * 
 * 
 * Backend API Example:
 * 
 * // GET /api/queues/my-position
 * router.get('/my-position', authenticateToken, async (req, res) => {
 *   try {
 *     const queue = await Queue.findOne({
 *       'currentUsers.user': req.user._id,
 *       'currentUsers.status': 'waiting'
 *     });
 * 
 *     if (!queue) {
 *       return res.json({
 *         success: false,
 *         message: 'Not in any queue'
 *       });
 *     }
 * 
 *     const userEntry = queue.currentUsers.find(
 *       u => u.user.toString() === req.user._id.toString()
 *     );
 * 
 *     res.json({
 *       success: true,
 *       data: {
 *         position: userEntry.position,
 *         queueLength: queue.currentUsers.filter(u => u.status === 'waiting').length,
 *         estimatedWaitTime: `${userEntry.estimatedWaitTime} min`,
 *         queueName: queue.name
 *       }
 *     });
 *   } catch (error) {
 *     res.status(500).json({ success: false, error: 'Server error' });
 *   }
 * });
 */
