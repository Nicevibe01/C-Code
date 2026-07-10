import { useState } from 'react';
import { X, User, Briefcase, Tags, Image } from 'lucide-react';
import { supabase } from './lib/supabase';

interface AddSpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeakerAdded: () => void;
}

const COLORS = ['#F5A623', '#22C55E', '#00B4D8', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AddSpeakerModal({ isOpen, onClose, onSpeakerAdded }: AddSpeakerModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    tags: '',
    image: 'https://i.pravatar.cc/200?img=' + Math.floor(Math.random() * 70),
    is_active: true,
    display_order: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get next display order
      const { data: speakers } = await supabase
        .from('speakers')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      const nextOrder = speakers && speakers.length > 0 ? speakers[0].display_order + 1 : 1;

      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(t => t);

      const { error } = await supabase
        .from('speakers')
        .insert([{
          name: form.name,
          role: form.role,
          tags: tagsArray,
          image: form.image,
          is_active: true,
          display_order: nextOrder
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      onSpeakerAdded();
      onClose();
      setForm({
        name: '',
        role: '',
        tags: '',
        image: 'https://i.pravatar.cc/200?img=' + Math.floor(Math.random() * 70),
        is_active: true,
        display_order: 0
      });
    } catch (error) {
      console.error('Error adding speaker:', error);
      alert('Failed to add speaker. Please try again.');
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
          <h2 className="text-white text-xl font-bold">Add New Speaker</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <User size={14} /> Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Briefcase size={14} /> Role
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="e.g., Senior Engineer at Google"
              required
            />
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Tags size={14} /> Tags (comma separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="e.g., React, TypeScript, System Design"
            />
          </div>

          <div>
            <label className="text-white/50 text-sm flex items-center gap-2 mb-1">
              <Image size={14} /> Image URL
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="https://i.pravatar.cc/200?img=1"
              required
            />
            <p className="text-white/30 text-xs mt-1">Use https://i.pravatar.cc/200?img=1 for random avatars</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5A623] text-[#0A1628] font-bold py-3 rounded-xl hover:bg-[#e0951e] transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Speaker'}
          </button>
        </form>
      </div>
    </div>
  );
}