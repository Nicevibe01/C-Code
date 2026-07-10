import { useState } from 'react';
import { X, Calendar, Clock, Video, Tag, FileText, Hash, Palette } from 'lucide-react';
import { supabase } from './lib/supabase';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: () => void;
}

const COLORS = ['#F5A623', '#22C55E', '#00B4D8', '#EF4444', '#8B5CF6', '#EC4899'];
const STATUSES = ['Upcoming', 'Open for Registration', 'Coming Soon'];
const FORMATS = ['Virtual (Google Meet)', 'Virtual & Physical', 'In Person'];

export default function AddEventModal({ isOpen, onClose, onEventAdded }: AddEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    n: 0,
    status: 'Upcoming',
    title: '',
    tag: '',
    desc: '',
    date: '',
    time: '',
    format: 'Virtual (Google Meet)',
    color: '#F5A623'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: events } = await supabase
        .from('events')
        .select('n')
        .order('n', { ascending: false })
        .limit(1);

      const nextN = events && events.length > 0 ? events[0].n + 1 : 1;

      const { error } = await supabase
        .from('events')
        .insert([{
          ...form,
          n: nextN,
          tag: form.tag || null
        }]);

      if (error) throw error;

      alert('Event added successfully!');
      onEventAdded();
      onClose();
      setForm({
        n: 0,
        status: 'Upcoming',
        title: '',
        tag: '',
        desc: '',
        date: '',
        time: '',
        format: 'Virtual (Google Meet)',
        color: '#F5A623'
      });
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#050B14]/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-[560px] bg-[#0A1628] border border-white/10 rounded-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Add New Event</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Hash size={14} /> Event Number
            </label>
            <input
              type="number"
              value={form.n}
              onChange={(e) => setForm({ ...form, n: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="e.g., 5"
              required
            />
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Tag size={14} /> Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="e.g., Advanced React Workshop"
              required
            />
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Tag size={14} /> Tag (optional)
            </label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="e.g., New, Featured"
            />
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <FileText size={14} /> Description
            </label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white min-h-[80px]"
              placeholder="Describe the event..."
              required
            />
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Calendar size={14} /> Date
            </label>
            <input
              type="text"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="e.g., December 15, 2026"
              required
            />
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Clock size={14} /> Time
            </label>
            <input
              type="text"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="e.g., 7:00 PM – 9:00 PM WAT"
              required
            />
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Video size={14} /> Format
            </label>
            <select
              value={form.format}
              onChange={(e) => setForm({ ...form, format: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Palette size={14} /> Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Palette size={14} /> Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    form.color === color ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5A623] text-[#0A1628] font-bold py-3 rounded-xl hover:bg-[#e0951e] transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Event'}
          </button>
        </form>
      </div>
    </div>
  );
}