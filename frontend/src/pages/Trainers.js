import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import trainerChatApi from '../utils/trainerChatApi';

const formatTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


const trainers = [
  {
    id: 1,
    name: 'Arun Kumar',
    specialization: 'Strength Training',
    experience: '9 years exp',
    available: true,
    description: 'Certified strength coach from Chennai focused on progressive overload, safe form, and functional fitness.',
    certification: 'SPEFL-SC, K11 Strength Coach',
    email: 'arun.kumar@wellnest.in',
    phone: '+91-98400-11001',
    hourlyRate: 1800,
    city: 'Chennai, Tamil Nadu'
  },
  {
    id: 2,
    name: 'Meena Lakshmi',
    specialization: 'Yoga & Flexibility',
    experience: '7 years exp',
    available: true,
    description: 'Traditional and therapeutic yoga trainer from Coimbatore specializing in vinyasa and mobility recovery.',
    certification: 'RYT-500, YCB Level-2',
    email: 'meena.lakshmi@wellnest.in',
    phone: '+91-98940-22002',
    hourlyRate: 1500,
    city: 'Coimbatore, Tamil Nadu'
  },
  {
    id: 3,
    name: 'Jeeva Prakash',
    specialization: 'Cardio & HIIT',
    experience: '10 years exp',
    available: true,
    description: 'HIIT and endurance specialist from Madurai helping clients improve stamina and fat-loss with structured plans.',
    certification: 'REPS India CPT, ACSM-CPT',
    email: 'jeeva.prakash@wellnest.in',
    phone: '+91-97890-33003',
    hourlyRate: 2000,
    city: 'Madurai, Tamil Nadu'
  },
  {
    id: 4,
    name: 'Shruthi Narayanan',
    specialization: 'Nutrition & Weight Loss',
    experience: '8 years exp',
    available: true,
    description: 'Weight management and nutrition coach from Tiruchirappalli focused on practical Indian diet planning.',
    certification: 'INFS Nutrition, ACE-CPT',
    email: 'shruthi.n@wellnest.in',
    phone: '+91-94430-44004',
    hourlyRate: 1700,
    city: 'Tiruchirappalli, Tamil Nadu'
  },
  {
    id: 5,
    name: 'Dinesh Balan',
    specialization: 'CrossFit & Functional',
    experience: '9 years exp',
    available: true,
    description: 'Functional fitness trainer from Salem helping improve mobility, movement quality, and injury prevention.',
    certification: 'CrossFit L2, FMS Level 1',
    email: 'dinesh.balan@wellnest.in',
    phone: '+91-93610-55005',
    hourlyRate: 2100,
    city: 'Salem, Tamil Nadu'
  },
  {
    id: 6,
    name: 'Ezhil Arasi',
    specialization: 'Pilates & Core',
    experience: '6 years exp',
    available: true,
    description: 'Pilates and posture specialist from Tirunelveli focused on core activation and spinal alignment.',
    certification: 'STOTT Pilates, REPS India CPT',
    email: 'ezhil.arasi@wellnest.in',
    phone: '+91-99520-66006',
    hourlyRate: 1600,
    city: 'Tirunelveli, Tamil Nadu'
  },
];

const specializations = [
  'All',
  'Strength Training',
  'Yoga & Flexibility',
  'Cardio & HIIT',
  'Nutrition & Weight Loss',
  'CrossFit & Functional',
  'Pilates & Core',
];

const Trainers = () => {
  const navigate = useNavigate();
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [bookedTrainerIds, setBookedTrainerIds] = useState(() => {
    try {
      const saved = localStorage.getItem('wellnestBookedTrainerIds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [bookingMessage, setBookingMessage] = useState('');
  const [trainerChats, setTrainerChats] = useState({});
  const [chatOpenForTrainer, setChatOpenForTrainer] = useState(null);
  const [chatDraft, setChatDraft] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  const filtered = useMemo(() => {
    if (selectedSpecialization === 'All') return trainers;
    return trainers.filter((trainer) => trainer.specialization === selectedSpecialization);
  }, [selectedSpecialization]);

  const handleBookSession = (trainer) => {
    if (bookedTrainerIds.includes(trainer.id)) {
      setBookingMessage(`You already booked ${trainer.name}. Check your consultation page.`);
      return;
    }

    const updated = [...bookedTrainerIds, trainer.id];
    setBookedTrainerIds(updated);
    localStorage.setItem('wellnestBookedTrainerIds', JSON.stringify(updated));
    setBookingMessage(`Session booked with ${trainer.name} (${trainer.city}).`);
  };

  const openChat = async (trainer) => {
    setChatOpenForTrainer(trainer);
    setChatDraft('');
    setChatError('');
    setChatLoading(true);

    try {
      const conversation = await trainerChatApi.getConversation(trainer.id);
      setTrainerChats((prev) => ({
        ...prev,
        [String(trainer.id)]: Array.isArray(conversation) ? conversation : []
      }));
    } catch (error) {
      setChatError(error.message || 'Unable to load chat. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatOpenForTrainer || !chatDraft.trim()) return;

    const trainerId = String(chatOpenForTrainer.id);
    const messageText = chatDraft.trim();
    setChatDraft('');
    setChatError('');

    try {
      await trainerChatApi.sendMessage(chatOpenForTrainer.id, {
        trainerName: chatOpenForTrainer.name,
        message: messageText
      });
      const refreshedConversation = await trainerChatApi.getConversation(chatOpenForTrainer.id);
      setTrainerChats((prev) => ({
        ...prev,
        [trainerId]: Array.isArray(refreshedConversation) ? refreshedConversation : []
      }));
    } catch (error) {
      setChatDraft(messageText);
      setChatError(error.message || 'Unable to send message. Please try again.');
    }
  };

  const currentChatMessages = useMemo(() => {
    if (!chatOpenForTrainer) return [];
    return trainerChats[String(chatOpenForTrainer.id)] || [];
  }, [chatOpenForTrainer, trainerChats]);

  return (
    <div className="min-h-screen wellnest-app-bg py-10 px-4">
      <div className="max-w-6xl mx-auto wellnest-content-layer">
        <PageHeader
          title="Our Expert Trainers"
          subtitle="Choose from certified Tamil Nadu trainers across all major fitness specializations."
          icon="💪"
          action={
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
            >
              Back to Dashboard
            </button>
          }
        />

        <div className="mb-6">
          <h2 className="wellnest-section-title mb-3">Filter by Specialization</h2>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedSpecialization === spec
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {bookingMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {bookingMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((trainer) => (
            <div key={trainer.id} className="wellnest-emoji-card p-6">
              <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
                {trainer.name[0]}
              </div>

              <h3 className="text-2xl font-bold text-gray-900">{trainer.name}</h3>
              <p className="text-green-600 font-semibold mt-1">{trainer.specialization}</p>
              <p className="text-xs text-gray-500 mt-1">📍 {trainer.city}</p>

              <div className="flex items-center gap-2 mt-3 text-xs">
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">⭐ {trainer.experience}</span>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">✓ Available</span>
              </div>

              <p className="text-gray-600 mt-4 text-sm leading-relaxed">{trainer.description}</p>

              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-1">
                <p className="uppercase text-xs text-gray-400 tracking-wide">Certification</p>
                <p className="font-medium text-gray-700">{trainer.certification}</p>
                <p>📧 {trainer.email}</p>
                <p>📱 {trainer.phone}</p>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Hourly Rate</p>
                  <p className="text-2xl font-bold text-green-600">₹{trainer.hourlyRate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openChat(trainer)}
                    className="px-4 py-2 rounded-lg font-semibold border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => handleBookSession(trainer)}
                    disabled={!trainer.available || bookedTrainerIds.includes(trainer.id)}
                    className={`px-5 py-2.5 rounded-lg font-semibold transition-colors ${
                      !trainer.available || bookedTrainerIds.includes(trainer.id)
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {bookedTrainerIds.includes(trainer.id) ? 'Booked ✓' : 'Book Session'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {chatOpenForTrainer && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="px-5 py-4 border-b bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chat with {chatOpenForTrainer.name}</h3>
                  <p className="text-xs text-gray-500">{chatOpenForTrainer.specialization}</p>
                </div>
                <button
                  onClick={() => setChatOpenForTrainer(null)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>

              <div className="h-[360px] overflow-y-auto px-5 py-4 space-y-3 bg-white">
                {currentChatMessages.length === 0 ? (
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed p-4">
                    Start chatting with {chatOpenForTrainer.name}. Ask about timings, training style, or goals.
                  </div>
                ) : (
                  currentChatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'USER' ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-100 text-gray-800'}`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === 'USER' ? 'text-blue-100' : 'text-gray-500'}`}>{formatTime(msg.createdAt)}</p>
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed p-4">
                    Loading conversation...
                  </div>
                )}
                {chatError && (
                  <div className="text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 p-3">
                    {chatError}
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t bg-slate-50 flex items-center gap-2">
                <input
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                />
                <button
                  onClick={sendChatMessage}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trainers;
