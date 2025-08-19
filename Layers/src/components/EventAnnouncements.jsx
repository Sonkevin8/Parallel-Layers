import React from 'react';

const EventAnnouncements = () => {
  const events = [
    { id: 1, title: 'Event 1', date: '2023-10-01', description: 'Description for Event 1' },
    { id: 2, title: 'Event 2', date: '2023-10-15', description: 'Description for Event 2' },
    { id: 3, title: 'Event 3', date: '2023-11-01', description: 'Description for Event 3' },
  ];

  return (
    <div>
      <h1>Upcoming Events</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <h2>{event.title}</h2>
            <p>Date: {event.date}</p>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventAnnouncements;