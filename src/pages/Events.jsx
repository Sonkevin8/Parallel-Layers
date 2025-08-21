import React, { useState, useEffect } from 'react';

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Community Art Workshop',
      date: '2024-12-28',
      time: '2:00 PM - 5:00 PM',
      location: 'Downtown Community Center',
      description: 'Join us for a collaborative art session where we create layers of expression together. Bring your creativity and connect with fellow community members.',
      poster: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: 23,
      maxAttendees: 50
    },
    {
      id: 2,
      title: 'Storytelling Circle',
      date: '2025-01-05',
      time: '7:00 PM - 9:00 PM',
      location: 'Riverside Park Pavilion',
      description: 'Share your layers of experience in our monthly storytelling gathering. Every story adds to our collective narrative.',
      poster: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: 15,
      maxAttendees: 30
    },
    {
      id: 3,
      title: 'Parallel Projects Showcase',
      date: '2025-01-15',
      time: '6:00 PM - 10:00 PM',
      location: 'Innovation Hub',
      description: 'Celebrate the creative projects born from our community. See how individual layers combine to create something beautiful.',
      poster: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: 42,
      maxAttendees: 100
    }
  ]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    poster: '',
    maxAttendees: 50
  });
  const [userAttendance, setUserAttendance] = useState(new Set());

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple admin check (in real app, this would be secure authentication)
    if (loginData.username === 'admin' && loginData.password === 'parallellayers2024') {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginData({ username: '', password: '' });
    } else {
      alert('Invalid credentials. Try username: admin, password: parallellayers2024');
    }
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      id: Date.now(),
      attendees: 0
    };
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      poster: '',
      maxAttendees: 50
    });
    setShowAddEvent(false);
  };

  const handleAttendEvent = (eventId) => {
    if (userAttendance.has(eventId)) {
      // User is already attending, remove them
      setUserAttendance(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, attendees: Math.max(0, event.attendees - 1) }
          : event
      ));
    } else {
      // User wants to attend
      const event = events.find(e => e.id === eventId);
      if (event && event.attendees < event.maxAttendees) {
        setUserAttendance(prev => new Set([...prev, eventId]));
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, attendees: event.attendees + 1 }
            : event
        ));
      }
    }
  };

  return (
    <div className="content-section">
      <div className="flex justify-between items-center mb-4">
        <h1>Event Announcements</h1>
        <div className="flex gap-2">
          {!isAdmin && (
            <button onClick={() => setShowLogin(true)} className="admin-btn">
              Admin Login
            </button>
          )}
          {isAdmin && (
            <>
              <button onClick={() => setShowAddEvent(true)} className="add-event-btn">
                Add Event
              </button>
              <button onClick={() => setIsAdmin(false)} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <p>
          Join us for events that build layers of connection and creativity. Each gathering is an opportunity to meet like-minded people, share experiences, and contribute to our growing community.
        </p>
      </div>

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Admin Login</h3>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
              <div className="modal-actions">
                <button type="submit">Login</button>
                <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Event</h3>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                required
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Time (e.g., 7:00 PM - 9:00 PM)"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                required
              />
              <textarea
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                rows="4"
                required
              />
              <input
                type="url"
                placeholder="Poster Image URL (optional)"
                value={newEvent.poster}
                onChange={(e) => setNewEvent({...newEvent, poster: e.target.value})}
              />
              <input
                type="number"
                placeholder="Max Attendees"
                value={newEvent.maxAttendees}
                onChange={(e) => setNewEvent({...newEvent, maxAttendees: parseInt(e.target.value)})}
                min="1"
                required
              />
              <div className="modal-actions">
                <button type="submit">Add Event</button>
                <button type="button" onClick={() => setShowAddEvent(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            {event.poster && (
              <div className="event-poster">
                <img src={event.poster} alt={event.title} />
              </div>
            )}
            <div className="event-content">
              <h3>{event.title}</h3>
              <div className="event-details">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </div>
              <p className="event-description">{event.description}</p>
              
              <div className="event-attendance">
                <div className="attendance-info">
                  <span className="attendee-count">
                    {event.attendees}/{event.maxAttendees} attending
                  </span>
                  <div className="attendance-bar">
                    <div 
                      className="attendance-fill" 
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <button 
                  className={`attend-btn ${userAttendance.has(event.id) ? 'attending' : ''}`}
                  onClick={() => handleAttendEvent(event.id)}
                  disabled={!userAttendance.has(event.id) && event.attendees >= event.maxAttendees}
                >
                  {userAttendance.has(event.id) 
                    ? 'Cancel Attendance' 
                    : event.attendees >= event.maxAttendees 
                      ? 'Event Full' 
                      : 'Attend Event'
                  }
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;