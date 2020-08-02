import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  useEffect(() => {
    fetch(
      'https://us-central1-baumann-firebase.cloudfunctions.net/getCalendarEvents',
    )
      .then((r) => r.json())
      .then((r) => {
        setCalendarEvents(r);
      });
  }, []);

  const handleEventClick = ({
    event: {
      _def: {
        extendedProps: { eventLink },
      },
    },
  }) => {
    window.open(eventLink);
  };
  return (
    <div style={{ backgroundColor: '#0d47a1', padding: '5%' }}>
      <div style={{ backgroundColor: '#8c9eff' }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          eventColor="black"
          dateClick={(event) => console.log('date  click', event)}
          eventClick={handleEventClick}
          events={calendarEvents}
        />
      </div>
    </div>
  );
};

export default Calendar;
