import { X, Calendar, Users } from 'lucide-react';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent: () => void;
  onSelectSpeaker: () => void;
}

export default function AddModal({ isOpen, onClose, onSelectEvent, onSelectSpeaker }: AddModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#050B14]/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0A1628] border border-white/10 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Add New</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Add Event Button */}
          <button
            onClick={() => {
              onSelectEvent();
              onClose();
            }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#F5A623] hover:bg-white/10 transition-all group"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#F5A623]/20 flex items-center justify-center group-hover:bg-[#F5A623]/30 transition-colors">
                <Calendar size={28} className="text-[#F5A623]" />
              </div>
              <div className="text-white font-semibold text-[15px]">Event</div>
              <div className="text-white/40 text-xs text-center">Add a new event to the program</div>
            </div>
          </button>

          {/* Add Speaker Button */}
          <button
            onClick={() => {
              onSelectSpeaker();
              onClose();
            }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#00B4D8] hover:bg-white/10 transition-all group"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#00B4D8]/20 flex items-center justify-center group-hover:bg-[#00B4D8]/30 transition-colors">
                <Users size={28} className="text-[#00B4D8]" />
              </div>
              <div className="text-white font-semibold text-[15px]">Speaker</div>
              <div className="text-white/40 text-xs text-center">Add a new community member</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}