import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Trash2, Plus, Edit, Check, X, Calendar, Menu, X as XIcon } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

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
      <div className="min-h-screen flex items-center justify-center bg-[#0A1628] p-4">
        <div className="bg-white/[0.05] p-6 sm:p-8 rounded-2xl border border-white/10 max-w-md w-full">
          <h2 className="text-white text-2xl font-bold mb-6">Admin Login</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5A623] transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-[#0A1628] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5A623] transition-colors"
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
    <div className="min-h-screen bg-[#0A1628] text-white p-4 sm:p-6 md:p-8">
      {/* SUCCESS TOAST */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-[200] bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] px-4 sm:px-6 py-3 rounded-xl backdrop-blur-md animate-in slide-in-from-top-5 text-sm sm:text-base max-w-[90vw] sm:max-w-full">
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-white/60 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-4 items-center flex-wrap">
            <button
              onClick={() => setShowAddEvent(true)}
              className="bg-[#F5A623] text-[#0A1628] px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#e0951e] transition-colors whitespace-nowrap"
            >
              <Plus size={18} /> Add Event
            </button>
            <span className="text-white/60 text-sm">
              Total: {registrations.length} registrations
            </span>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setRegistrations([]);
                setEvents([]);
              }}
              className="text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Actions */}
        {mobileMenuOpen && (
          <div className="sm:hidden flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
            <button
              onClick={() => {
                setShowAddEvent(true);
                setMobileMenuOpen(false);
              }}
              className="bg-[#F5A623] text-[#0A1628] px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#e0951e] transition-colors"
            >
              <Plus size={18} /> Add Event
            </button>
            <div className="text-white/60 text-sm text-center">
              Total: {registrations.length} registrations
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setRegistrations([]);
                setEvents([]);
              }}
              className="text-red-400 hover:text-red-300 transition-colors text-center"
            >
              Logout
            </button>
          </div>
        )}

        {/* EVENTS SECTION */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-[#F5A623]" />
            Events ({events.length})
          </h2>
          
          {/* Mobile Event Cards */}
          <div className="sm:hidden space-y-4">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white/40 text-sm">#{ev.n}</span>
                  <StatusPill status={ev.status} />
                </div>
                <div className="mb-2">
                  {editingEvent?.id === ev.id ? (
                    <input
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="bg-[#0A1628] border border-white/10 rounded px-2 py-1 text-white w-full"
                    />
                  ) : (
                    <span style={{ color: ev.color }} className="font-medium">
                      {ev.title}
                    </span>
                  )}
                </div>
                <div className="text-white/60 text-sm mb-3">{ev.date}</div>
                <div className="flex gap-2 flex-wrap">
                  {editingEvent?.id === ev.id ? (
                    <>
                      <button
                        onClick={saveEventEdit}
                        className="text-green-400 hover:text-green-300 p-1 flex-1 bg-green-500/10 rounded-lg justify-center flex items-center gap-1"
                      >
                        <Check size={16} /> Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-400 hover:text-red-300 p-1 flex-1 bg-red-500/10 rounded-lg justify-center flex items-center gap-1"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(ev)}
                        className="text-blue-400 hover:text-blue-300 p-2 flex-1 bg-blue-500/10 rounded-lg justify-center flex items-center gap-1"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(ev.id, ev.title)}
                        className="text-red-400 hover:text-red-300 p-2 flex-1 bg-red-500/10 rounded-lg justify-center flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                      <select
                        onChange={(e) => updateEventStatus(ev.id, e.target.value)}
                        value=""
                        className="flex-1 bg-[#0A1628] border border-white/10 rounded-lg px-2 py-1 text-white text-xs"
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
              </div>
            ))}
          </div>

          {/* Desktop Event Table */}
          <div className="hidden sm:block overflow-x-auto">
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
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Registrations ({registrations.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-12 text-white/60">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 text-white/40">No registrations yet.</div>
          ) : (
            <>
              {/* Mobile Registration Cards */}
              <div className="sm:hidden space-y-4">
                {registrations.map((reg, index) => (
                  <div key={reg.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white/40 text-sm">#{index + 1}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        reg.payment_status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {reg.payment_status}
                      </span>
                    </div>
                    <div className="font-medium mb-1">{reg.name}</div>
                    <div className="text-white/60 text-sm">{reg.email}</div>
                    <div className="text-white/60 text-sm">{reg.phone || '-'}</div>
                    <div className="text-white/60 text-sm">{reg.country}</div>
                    <div className="text-white/60 text-sm">{reg.event_title}</div>
                    <div className="text-white/40 text-xs mt-1">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => deleteRegistration(reg.id, reg.email)}
                      className="mt-3 w-full text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Delete Member
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop Registration Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="p-4 text-left">#</th>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left hidden md:table-cell">Phone</th>
                      <th className="p-4 text-left hidden lg:table-cell">Country</th>
                      <th className="p-4 text-left hidden xl:table-cell">Event</th>
                      <th className="p-4 text-left hidden lg:table-cell">Date</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, index) => (
                      <tr key={reg.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 font-medium">{reg.name}</td>
                        <td className="p-4 text-white/70 text-sm">{reg.email}</td>
                        <td className="p-4 text-white/70 hidden md:table-cell">{reg.phone || '-'}</td>
                        <td className="p-4 text-white/70 hidden lg:table-cell">{reg.country}</td>
                        <td className="p-4 text-white/70 hidden xl:table-cell">{reg.event_title}</td>
                        <td className="p-4 text-white/70 hidden lg:table-cell">
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
            </>
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