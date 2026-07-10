import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Trash2, Plus, Edit, Check, X, Calendar } from 'lucide-react';
import AddEventModal from './addEventModal';

interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  event_title: string;
  created_at: string;
  payment_status: string;
}

interface Event {
  id: number;
  n: number;
  status: string;
  title: string;
  tag: string | null;
  description: string;
  date: string;
  time: string;
  format: string;
  color: string;
}

export default function Admin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      if (data) {
        console.log('Login successful:', data);
        setIsAuthenticated(true);
        fetchRegistrations();
        fetchEvents();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('n', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // DELETE MEMBER FUNCTION
  const deleteRegistration = async (id: number, email: string) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRegistrations(registrations.filter(reg => reg.id !== id));
      showSuccessToast('Member deleted successfully!');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member. Please try again.');
    }
  };

  // DELETE EVENT FUNCTION
  const deleteEvent = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(events.filter(ev => ev.id !== id));
      showSuccessToast(`"${title}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  // UPDATE EVENT STATUS FUNCTION
  const updateEventStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setEvents(events.map(ev => 
        ev.id === id ? { ...ev, status: newStatus } : ev
      ));
      showSuccessToast(`Event status updated to "${newStatus}"!`);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event status.');
    }
  };

  // SUCCESS TOAST
  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Edit Event Modal - Simple inline edit
  const startEditing = (event: Event) => {
    setEditingEvent(event);
  };

  const cancelEditing = () => {
    setEditingEvent(null);
  };

  const saveEventEdit = async () => {
    if (!editingEvent) return;

    try {
      const { error } = await supabase
        .from('events')
        .update({
          status: editingEvent.status,
          title: editingEvent.title,
          description: editingEvent.description,
          date: editingEvent.date,
          time: editingEvent.time,
          format: editingEvent.format,
          color: editingEvent.color
        })
        .eq('id', editingEvent.id);

      if (error) throw error;

      setEvents(events.map(ev => 
        ev.id === editingEvent.id ? editingEvent : ev
      ));
      showSuccessToast('Event updated successfully!');
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to update event.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
        <div className="bg-white/[0.05] p-8 rounded-2xl border border-white/10 max-w-md w-full">
          <h2 className="text-white text-2xl font-bold mb-6">Admin Login</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30"
            />
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-[#F5A623] text-[#0A1628] font-bold py-3 rounded-xl hover:bg-[#e0951e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-white p-8">
      {/* SUCCESS TOAST */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-[200] bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] px-6 py-3 rounded-xl backdrop-blur-md animate-in slide-in-from-top-5">
          ✅ {successMessage}
        </div>
      )}

      {/* ADD EVENT MODAL */}
      <AddEventModal
        isOpen={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onEventAdded={() => {
          fetchEvents();
          showSuccessToast('Event added successfully!');
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowAddEvent(true)}
              className="bg-[#F5A623] text-[#0A1628] px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#e0951e] transition-colors"
            >
              <Plus size={18} /> Add Event
            </button>
            <span className="text-white/60">
              Total: {registrations.length} registrations
            </span>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setRegistrations([]);
                setEvents([]);
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* EVENTS SECTION */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-[#F5A623]" />
            Events ({events.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-3 text-left text-sm">#</th>
                  <th className="p-3 text-left text-sm">Title</th>
                  <th className="p-3 text-left text-sm">Status</th>
                  <th className="p-3 text-left text-sm">Date</th>
                  <th className="p-3 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3">{ev.n}</td>
                    <td className="p-3 font-medium">
                      {editingEvent?.id === ev.id ? (
                        <input
                          value={editingEvent.title}
                          onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                          className="bg-[#0A1628] border border-white/10 rounded px-2 py-1 text-white w-full"
                        />
                      ) : (
                        <span style={{ color: ev.color }}>{ev.title}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {editingEvent?.id === ev.id ? (
                        <select
                          value={editingEvent.status}
                          onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                          className="bg-[#0A1628] border border-white/10 rounded px-2 py-1 text-white"
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="Open for Registration">Open for Registration</option>
                          <option value="Coming Soon">Coming Soon</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <StatusPill status={ev.status} />
                      )}
                    </td>
                    <td className="p-3 text-white/70">{ev.date}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {editingEvent?.id === ev.id ? (
                          <>
                            <button
                              onClick={saveEventEdit}
                              className="text-green-400 hover:text-green-300 p-1"
                              title="Save"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(ev)}
                              className="text-blue-400 hover:text-blue-300 p-1"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteEvent(ev.id, ev.title)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                            <select
                              onChange={(e) => updateEventStatus(ev.id, e.target.value)}
                              value=""
                              className="bg-[#0A1628] border border-white/10 rounded px-2 py-1 text-white text-xs"
                            >
                              <option value="">Quick Status</option>
                              <option value="Upcoming">Upcoming</option>
                              <option value="Open for Registration">Open for Registration</option>
                              <option value="Coming Soon">Coming Soon</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* REGISTRATIONS SECTION */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Registrations ({registrations.length})</h2>
          {loading ? (
            <div className="text-center py-12 text-white/60">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 text-white/40">No registrations yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-white/10 rounded-xl overflow-hidden">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-left">#</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Phone</th>
                    <th className="p-4 text-left">Country</th>
                    <th className="p-4 text-left">Event</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, index) => (
                    <tr key={reg.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4 font-medium">{reg.name}</td>
                      <td className="p-4 text-white/70">{reg.email}</td>
                      <td className="p-4 text-white/70">{reg.phone || '-'}</td>
                      <td className="p-4 text-white/70">{reg.country}</td>
                      <td className="p-4 text-white/70">{reg.event_title}</td>
                      <td className="p-4 text-white/70">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reg.payment_status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {reg.payment_status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteRegistration(reg.id, reg.email)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-500/10"
                          title="Delete member"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// StatusPill component for events
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    "Upcoming": { bg: "#F5A62318", text: "#F5A623", border: "#F5A62340" },
    "Open for Registration": { bg: "#22C55E18", text: "#22C55E", border: "#22C55E40" },
    "Coming Soon": { bg: "#00B4D818", text: "#00B4D8", border: "#00B4D840" },
    "Completed": { bg: "#8B5CF618", text: "#8B5CF6", border: "#8B5CF640" },
    "Cancelled": { bg: "#EF444418", text: "#EF4444", border: "#EF444440" },
  };
  const c = map[status] || map["Upcoming"];
  return (
    <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-full border" style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {status}
    </span>
  );
}