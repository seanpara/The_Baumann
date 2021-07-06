import { Button, TextareaAutosize, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

import { eventState, authState } from "../atoms";

interface Event {
  date: string;
  month: string;
  description: string;
  name: string;
}
export interface EventMap {
  [month: string]: Event[];
}

const formatDate = (date: string): string => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const Calendar = (): JSX.Element => {
  const [events, setEvents] = useRecoilState(eventState);
  const [{ isSignedIn, isValid }] = useRecoilState(authState);
  const [eventBeingEdited, setEventBeingEdited] = useState<string | null>(null);
  console.log({ events });

  const handleEventChange = (
    newValue: string,
    valueKey: string,
    month: string,
    eventName: string
  ): void => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [month]: prevEvents[month].map((prevEvent) =>
        prevEvent.name === eventName
          ? { ...prevEvent, [valueKey]: newValue }
          : prevEvent
      ),
    }));
  };

  const renderSingleEvent = (
    { date, description, name: eventName }: Event,
    month: string
  ): JSX.Element => {
    const isEventBeingEdited = eventBeingEdited === eventName;
    return (
      <div
        style={{
          display: "flex",
          height: "50%",
          justifyContent: "space-between",
          marginBottom: "3%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "65%",
            justifyContent: "flex-start",
          }}
        >
          {
            <Button
              onClick={() =>
                setEventBeingEdited(isEventBeingEdited ? null : eventName)
              }
              style={{ backgroundColor: "grey" }}
            >
              Edit
            </Button>
          }
          <div style={{ fontSize: "35px" }}>
            {isEventBeingEdited ? (
              <TextField
                variant="outlined"
                type="text"
                label={eventName}
                value={eventName}
                onChange={({ target: { value: newValue } }) =>
                  handleEventChange(newValue, "name", month, eventName)
                }
              />
            ) : (
              eventName.toUpperCase()
            )}
          </div>
          <div style={{ fontSize: "25px" }}>
            {isEventBeingEdited ? (
              <TextField
                variant="outlined"
                type="date"
                value={formatDate(date)}
                onChange={({ target: { value: newValue } }) =>
                  handleEventChange(newValue, "date", month, eventName)
                }
              />
            ) : (
              date
            )}
          </div>

          <div style={{ width: "90%", alignSelf: "left" }}>
            {isEventBeingEdited ? (
              <TextareaAutosize
                style={{ width: "100%" }}
                value={description}
                onChange={({ target: { value: newValue } }) =>
                  handleEventChange(newValue, "description", month, eventName)
                }
              />
            ) : (
              description
            )}
          </div>
          <div
            style={{
              borderTop: "solid black",
            }}
          >
            {isEventBeingEdited ? (
              <TextField style={{ width: "100%" }} value={"Time to go here"} />
            ) : (
              "Lasts All Day: Free Admission"
            )}
          </div>
        </div>
        {isEventBeingEdited ? (
          <TextField style={{ width: "100%" }} value={"Link to go here"} />
        ) : (
          <img
            style={{ width: "30%", height: "auto" }}
            src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Adolph_Tidemand_Norsk_juleskik.jpg"
            alt=""
          />
        )}
      </div>
    );
  };
  console.log({ isSignedIn, isValid });

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
            height: "10",
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
        {events[month].map((event) => renderSingleEvent(event, month))}
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
