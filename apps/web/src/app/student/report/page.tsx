'use client';
import { useState } from 'react';

const OFFICES = [
  { id: 'campus_security', name: 'Campus Security Office', desc: 'Safety threats, theft, harassment' },
  { id: 'dean_students', name: 'Dean of Students', desc: 'Disciplinary issues, welfare concerns' },
  { id: 'it_support', name: 'IT Support Desk', desc: 'Network issues, system access problems' },
  { id: 'health_center', name: 'University Health Center', desc: 'Medical emergencies, health concerns' },
  { id: 'academic_affairs', name: 'Academic Affairs Office', desc: 'Grading disputes, course issues' },
  { id: 'housing', name: 'Housing & Accommodation', desc: 'Hostel issues, maintenance requests' },
];

export default function ReportingPage() {
  const [mode, setMode] = useState<'public' | 'anonymous'>('anonymous');
  const [formData, setFormData] = useState({ category: '', details: '', officeId: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'anonymous' && !formData.officeId) {
      alert('Please select an office to address for anonymous reports.');
      return;
    }
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, mode, entityId: 'demo-id' }),
      });
      setSubmitted(true);
    } catch (err) { console.error(err); }
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Report Submitted Successfully</h2>
        <p className="text-gray-600 mb-6">{mode === 'anonymous' ? 'Your anonymous report has been securely routed to the selected office.' : 'Your public post has been shared with the campus community.'}</p>
        <button onClick={() => setSubmitted(false)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">Submit Another Report</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Issues & Safety Reporting</h1>
      <p className="text-gray-600 mb-6">Choose how you want to raise your concern.</p>

      {/* Mode Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-1 mb-6 flex">
        <button onClick={() => setMode('public')} className={`flex-1 py-3 rounded-lg font-medium transition-colors ${mode === 'public' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
          📢 Public Post
        </button>
        <button onClick={() => setMode('anonymous')} className={`flex-1 py-3 rounded-lg font-medium transition-colors ${mode === 'anonymous' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
          🔒 Anonymous Report
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
        {mode === 'anonymous' && (
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Select Office to Address *</label>
            <select required value={formData.officeId} onChange={e => setFormData({...formData, officeId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option value="">-- Choose an office --</option>
              {OFFICES.map(o => <option key={o.id} value={o.id}>{o.name} ({o.desc})</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-1">Your identity will not be shared with the selected office.</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3">
            <option value="">-- Select category --</option>
            <option value="safety">Safety / Threat</option>
            <option value="harassment">Harassment / Bullying</option>
            <option value="infrastructure">Infrastructure / Maintenance</option>
            <option value="academic">Academic Issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Details</label>
          <textarea required minLength={10} value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} placeholder={mode === 'public' ? 'Share your concern with the campus community...' : 'Describe the issue in detail...'} className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <button type="submit" className={`w-full font-bold py-4 rounded-xl text-white transition-colors shadow-lg ${mode === 'public' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20' : 'bg-red-600 hover:bg-red-700 shadow-red-900/20'}`}>
          {mode === 'public' ? '📢 Post to Campus Feed' : '🔒 Submit Anonymous Report'}
        </button>
      </form>
    </div>
  );
}
