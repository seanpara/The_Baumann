import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  useEffect(() => {
    fetch(
      'https://us-central1-baumann-firebase.cloudfunctions.net/getCalendarEvents',
    )
      .then((r) => r.json())
      .then((r) => {
        setCalendarEvents(
          r.reduce(
            (acc, cur) => ({
              ...acc,
              [Object.values(cur)[0].month]: Object.values(cur),
            }),
            {},
          ),
        );
      });
  }, []);

  const renderEvents = () =>
    Object.keys(calendarEvents).map((month) => (
      <>
        <div
          style={{
            borderBottom: 'solid black',
            width: '100%',
            marginTop: '5%',
            marginBottom: '1%',
          }}
        >
          <div style={{ fontSize: '70px' }}> {month.toUpperCase()}</div>
        </div>

        {calendarEvents[month].map(({ date, description, name }) => {
          return (
            <div style={{ display: 'flex', width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: 'auto',
                  height: '100%',
                  justifyContent: 'space-apart',
                }}
              >
                <div style={{ fontSize: '25px' }}>{date}</div>
                <div style={{ fontSize: '35px' }}>{name.toUpperCase()}</div>

                <div style={{ width: '90%', alignSelf: 'left' }}>
                  {description}
                </div>

                <div
                  style={{
                    borderTop: 'solid black',

                    width: '60%',
                  }}
                >
                  Lasts All Day: Free Admission
                </div>
              </div>

              <img
                style={{ width: '50%', height: 'auto' }}
                src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Adolph_Tidemand_Norsk_juleskik.jpg"
                alt=""
              />
            </div>
          );
        })}
      </>
    ));

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
      {renderEvents()}
    </div>
  );
};

export default Calendar;
