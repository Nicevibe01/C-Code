import { useState } from 'react';
import { supabase } from './lib/supabase';

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

export default function Admin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ADD THIS - Loading state for login
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true); // Start loading
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
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    } finally {
      setIsLoggingIn(false); // Stop loading
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span className="text-white/60">
              Total: {registrations.length} registrations
            </span>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setRegistrations([]);
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}