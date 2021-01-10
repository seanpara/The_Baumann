import React, { useState, useEffect } from 'react';

interface Event {
  date: string;
  month: string;
  description: string;
  name: string;
}
interface EventMap {
  [month: string]: Event[];
}

const Calendar = (): JSX.Element => {
  const [calendarEvents, setCalendarEvents] = useState<EventMap>({});

  useEffect(() => {
    fetch(
      'https://us-central1-baumann-firebase.cloudfunctions.net/getCalendarEvents',
    )
      .then((r) => r.json())
      .then((r: Event[][]) => {
        setCalendarEvents(
          r
            .sort(
              ([{ date: monthDateA }], [{ date: monthDateB }]) =>
                Date.parse(monthDateA) - Date.parse(monthDateB),
            )
            .reduce(
              (acc: EventMap, cur): EventMap => ({
                ...acc,
                [cur[0].month]: [...cur].sort(
                  ({ date: dateA }, { date: dateB }) =>
                    Date.parse(dateA) - Date.parse(dateB),
                ),
              }),
              {} as EventMap,
            ),
        );
      });
  }, []);

  const renderSingleEvent = ({
    date,
    description,
    name,
  }: Event): JSX.Element => (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '50%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'auto',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '25px' }}>{date}</div>
        <div style={{ fontSize: '35px' }}>{name.toUpperCase()}</div>
        <div style={{ width: '90%', alignSelf: 'left' }}>{description}</div>
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
        style={{ width: 'auto', height: '10%' }}
        src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Adolph_Tidemand_Norsk_juleskik.jpg"
        alt=""
      />
    </div>
  );

  const renderEvents = (): JSX.Element[] =>
    Object.keys(calendarEvents).map((month) => (
      <>
        <div
          style={{
            borderBottom: 'solid black',
            width: '100%',
            marginTop: '5%',
            marginBottom: '1%',
            position: 'sticky',
            top: '0px',
            zIndex: 1,
            backgroundColor: '#8c9eff',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '70px' }}>{month.toUpperCase()}</div>
        </div>
        {calendarEvents[month].map(renderSingleEvent)}
      </>
    ));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
        height: '100%',
        backgroundColor: '#8c9eff',
        padding: '0% 5%',
      }}
    >
      {renderEvents()}
    </div>
  );
};

export default Calendar;
