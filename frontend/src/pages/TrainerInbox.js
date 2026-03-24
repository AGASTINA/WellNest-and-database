import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import trainerChatApi from '../utils/trainerChatApi';

const trainers = [
  { id: 1, name: 'Arun Kumar', specialization: 'Strength Training' },
  { id: 2, name: 'Meena Lakshmi', specialization: 'Yoga & Flexibility' },
  { id: 3, name: 'Jeeva Prakash', specialization: 'Cardio & HIIT' },
  { id: 4, name: 'Shruthi Narayanan', specialization: 'Nutrition & Weight Loss' },
  { id: 5, name: 'Dinesh Balan', specialization: 'CrossFit & Functional' },
  { id: 6, name: 'Ezhil Arasi', specialization: 'Pilates & Core' }
];

const formatTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const TrainerInbox = () => {
  const navigate = useNavigate();
  const [selectedTrainerId, setSelectedTrainerId] = useState(trainers[0].id);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');

  const selectedTrainer = useMemo(
    () => trainers.find((trainer) => trainer.id === selectedTrainerId) || trainers[0],
    [selectedTrainerId]
  );

  const loadThreads = async (trainerId) => {
    setLoadingThreads(true);
    setError('');
    try {
      const data = await trainerChatApi.getTrainerThreads(trainerId);
      const threadList = Array.isArray(data) ? data : [];
      setThreads(threadList);

      if (!threadList.length) {
        setSelectedThread(null);
        setMessages([]);
        return;
      }

      const stillExists = selectedThread && threadList.some((thread) => thread.userId === selectedThread.userId);
      const nextThread = stillExists ? selectedThread : threadList[0];
      setSelectedThread(nextThread);
    } catch (e) {
      setError(e.message || 'Unable to load trainer inbox.');
      setThreads([]);
      setSelectedThread(null);
      setMessages([]);
    } finally {
      setLoadingThreads(false);
    }
  };

  const loadConversation = async (trainerId, userId) => {
    if (!userId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    setError('');
    try {
      const data = await trainerChatApi.getConversationForTrainer(trainerId, userId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Unable to load conversation.');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadThreads(selectedTrainerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrainerId]);

  useEffect(() => {
    if (!selectedThread?.userId) {
      setMessages([]);
      return;
    }
    loadConversation(selectedTrainerId, selectedThread.userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThread?.userId, selectedTrainerId]);

  const handleSend = async () => {
    if (!selectedThread?.userId || !draft.trim()) return;

    const messageText = draft.trim();
    setDraft('');
    setError('');

    try {
      await trainerChatApi.sendTrainerReply(selectedTrainerId, selectedThread.userId, {
        trainerName: selectedTrainer.name,
        message: messageText
      });
      await loadConversation(selectedTrainerId, selectedThread.userId);
      await loadThreads(selectedTrainerId);
    } catch (e) {
      setDraft(messageText);
      setError(e.message || 'Unable to send reply.');
    }
  };

  return (
    <div className="min-h-screen wellnest-app-bg py-10 px-4">
      <div className="max-w-7xl mx-auto wellnest-content-layer">
        <PageHeader
          title="Trainer Inbox"
          subtitle="Manage user conversations and reply as trainer/admin."
          icon="💬"
          action={
            <button
              onClick={() => navigate('/admin')}
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
            >
              Back to Admin
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 wellnest-emoji-card p-4">
            <h3 className="font-bold text-gray-900 mb-3">Select Trainer</h3>
            <div className="space-y-2">
              {trainers.map((trainer) => (
                <button
                  key={trainer.id}
                  onClick={() => setSelectedTrainerId(trainer.id)}
                  className={`w-full text-left rounded-xl border px-3 py-2 transition-colors ${
                    selectedTrainerId === trainer.id
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-semibold text-sm">{trainer.name}</p>
                  <p className="text-xs text-gray-500">{trainer.specialization}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 wellnest-emoji-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Threads</h3>
              {loadingThreads && <span className="text-xs text-gray-500">Loading…</span>}
            </div>

            {!threads.length && !loadingThreads ? (
              <div className="text-sm text-gray-500 border border-dashed rounded-xl p-4 bg-gray-50">
                No chats yet for {selectedTrainer.name}.
              </div>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {threads.map((thread) => (
                  <button
                    key={`${thread.userId}-${thread.lastMessageAt}`}
                    onClick={() => setSelectedThread(thread)}
                    className={`w-full text-left rounded-xl border p-3 transition-colors ${
                      selectedThread?.userId === thread.userId
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900">{thread.userName || `User #${thread.userId}`}</p>
                    <p className="text-xs text-gray-500 truncate">{thread.userEmail}</p>
                    <p className="text-xs text-gray-700 mt-1 truncate">
                      {thread.lastSender === 'TRAINER' ? 'You: ' : 'User: '}
                      {thread.lastMessage}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatTime(thread.lastMessageAt)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 wellnest-emoji-card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b bg-slate-50">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedThread ? `Chat with ${selectedThread.userName || `User #${selectedThread.userId}`}` : 'Select a thread'}
              </h3>
              {selectedThread && <p className="text-xs text-gray-500">{selectedThread.userEmail}</p>}
            </div>

            <div className="h-[420px] overflow-y-auto px-5 py-4 space-y-3 bg-white">
              {!selectedThread ? (
                <div className="text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed p-4">
                  Pick a user conversation from the thread list.
                </div>
              ) : loadingMessages ? (
                <div className="text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed p-4">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed p-4">No messages in this thread yet.</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'TRAINER' ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-100 text-gray-800'}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'TRAINER' ? 'text-blue-100' : 'text-gray-500'}`}>{formatTime(msg.createdAt)}</p>
                  </div>
                ))
              )}

              {error && (
                <div className="text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 p-3">
                  {error}
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t bg-slate-50 flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={!selectedThread}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder={selectedThread ? 'Type reply as trainer...' : 'Select a thread to reply'}
              />
              <button
                onClick={handleSend}
                disabled={!selectedThread || !draft.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerInbox;
