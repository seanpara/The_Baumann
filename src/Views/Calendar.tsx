import React from "react";
import { useRecoilState } from "recoil";

import { eventState } from "../atoms";

interface Event {
  date: string;
  month: string;
  description: string;
  name: string;
}
export interface EventMap {
  [month: string]: Event[];
}

const Calendar = (): JSX.Element => {
  const [events] = useRecoilState(eventState);

  const renderSingleEvent = ({
    date,
    description,
    name,
  }: Event): JSX.Element => (
    <div
      style={{
        display: "flex",
        height: "50vh",
        justifyContent: "space-between",
        marginBottom: "3%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          justifyContent: "flex-start",
        }}
      >
        <div style={{ fontSize: "35px" }}>{name.toUpperCase()}</div>
        <div style={{ fontSize: "25px" }}>{date}</div>

        <div style={{ width: "90%", alignSelf: "left" }}>{description}</div>
        <div
          style={{
            borderTop: "solid black",
          }}
        >
          Lasts All Day: Free Admission
        </div>
      </div>
      <img
        style={{ width: "30%", height: "auto" }}
        src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Adolph_Tidemand_Norsk_juleskik.jpg"
        alt=""
      />
    </div>
  );

  const renderEvents = (): JSX.Element[] =>
    Object.keys(events).map((month) => (
      <div
        key={month}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "auto",
          height: "100%",
        }}
      >
        <div
          style={{
            borderBottom: "solid black",
            width: "100%",
            marginTop: "5%",
            marginBottom: "1%",
            position: "sticky",
            top: "0px",
            zIndex: 1,
            backgroundColor: "#8c9eff",
            cursor: "pointer",
            fontSize: "70px",
          }}
        >
          {month.toUpperCase()}
        </div>
        {events[month].map(renderSingleEvent)}
      </div>
    ));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "auto",
        height: "100%",
        backgroundColor: "#8c9eff",
        padding: "0% 5%",
      }}
    >
      {renderEvents()}
    </div>
  );
};

export default Calendar;
