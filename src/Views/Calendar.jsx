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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
        height: '100vh',
        backgroundColor: '#8c9eff',
        padding: '0% 5%',
      }}
    >
      <div
        style={{
          borderBottom: 'solid black',
          width: '100%',
          marginTop: '5%',
          marginBottom: '1%',
        }}
      >
        <div style={{ fontSize: '70px' }}>DECEMBER</div>
      </div>
      <div style={{ display: 'flex', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'auto',
          }}
        >
          <div style={{ fontSize: '20px' }}>DEC. 25</div>
          <div style={{ fontSize: '30px' }}>CHRISTMAS</div>

          <div style={{ width: '90%', alignSelf: 'left' }}>
            Christmas (or the Feast of the Nativity) is an annual festival
            commemorating the birth of Jesus Christ, observed primarily on
            December 25 as a religious and cultural celebration among billions
            of people around the world. A feast central to the Christian
            liturgical year, it is preceded by the season of Advent or the
            Nativity Fast and initiates the season of Christmastide, which
            historically in the West lasts twelve days and culminates on Twelfth
            Night; in some traditions, Christmastide includes an
            octave.Christmas Day is a public holiday in many of the world's
            nations, is celebrated religiously by a majority of Christians, as
            well as culturally by many non-Christians, and forms an integral
            part of the holiday season centered around it.
          </div>
        </div>

        <img
          style={{ width: '40%', height: 'autos' }}
          src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Adolph_Tidemand_Norsk_juleskik.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default Calendar;
