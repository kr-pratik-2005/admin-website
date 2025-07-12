import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, addDoc,deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const HolidayModal = () => {
  const [holidays, setHolidays] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ date: '', occasion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch holidays from Firestore
  const fetchHolidays = async () => {
    const snapshot = await getDocs(collection(db, 'holidays'));
    setHolidays(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  const handleRemoveHoliday = async (holidayId) => {
  if (!window.confirm('Are you sure you want to remove this holiday?')) return;

  try {
    await deleteDoc(doc(db, 'holidays', holidayId));
    // Remove from local state so UI updates immediately
    setHolidays(prev => prev.filter(h => h.id !== holidayId));
  } catch (error) {
    alert('Failed to remove holiday: ' + error.message);
  }
};


  useEffect(() => {
    fetchHolidays();
    // eslint-disable-next-line
  }, []);

  // Add holiday handler
  const handleAddHoliday = async () => {
    setError('');
    if (!newHoliday.date || !newHoliday.occasion) {
      setError('Both fields are required');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'holidays'), newHoliday);
      setShowAddForm(false);
      setNewHoliday({ date: '', occasion: '' });
      await fetchHolidays();
    } catch (err) {
      setError('Failed to add holiday');
    }
    setLoading(false);
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '600px',
      margin: '2rem auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Holidays</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            Add Holidays
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Add Holiday Form */}
      {showAddForm && (
        <div style={{
          position: 'absolute',
          top: 70,
          right: 30,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 2000,
          minWidth: 250
        }}>
          <h4 style={{ margin: 0, marginBottom: 12 }}>Add Holiday</h4>
          <div style={{ marginBottom: 8 }}>
            <label>Date: </label>
            <input
              type="date"
              value={newHoliday.date}
              onChange={e => setNewHoliday({ ...newHoliday, date: e.target.value })}
              style={{ width: '100%', padding: 4, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Occasion: </label>
            <input
              type="text"
              value={newHoliday.occasion}
              onChange={e => setNewHoliday({ ...newHoliday, occasion: e.target.value })}
              style={{ width: '100%', padding: 4, marginTop: 4 }}
              placeholder="e.g. Maha Shivaratri"
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button
            onClick={handleAddHoliday}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Holiday'}
          </button>
          <button
            onClick={() => { setShowAddForm(false); setError(''); }}
            style={{
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              marginLeft: 8,
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Holidays List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
  {holidays.length === 0 ? (
    <li>No holidays found.</li>
  ) : (
    holidays.map(holiday => (
      <li key={holiday.id} style={{ 
        padding: '0.5rem 0', 
        borderBottom: '1px solid #e5e7eb', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div>
          <strong>{holiday.occasion}</strong>
          <span style={{ marginLeft: 12, color: '#6b7280' }}>
            {holiday.date}
          </span>
        </div>
        <button
          onClick={() => handleRemoveHoliday(holiday.id)}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 10px',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
          title="Remove Holiday"
        >
          Remove
        </button>
      </li>
    ))
  )}
</ul>

    </div>
  );
};

export default HolidayModal;
