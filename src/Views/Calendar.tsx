import { Button, TextareaAutosize, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

import { eventState, authState } from "../atoms";
// TO DO add proper types sry
const groupBy = (objArry: any, keyToGroupBy: any) =>
  objArry.reduce((mappedObjs: any, curentObject: any) => {
    if (curentObject[keyToGroupBy]) {
      (mappedObjs[curentObject[keyToGroupBy]] =
        mappedObjs[curentObject[keyToGroupBy]] || []).push(curentObject);
    }

    return mappedObjs;
  }, {});

export interface CalendarEvent {
  date: string;
  month: string;
  description: string;
  name: string;
  imageSrc: string;
  timeOfDay: string;
  id: string;
}
export interface EventMap {
  [id: string]: CalendarEvent;
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

const writeCalendarEventData = async (
  eventId: string,
  valueKey: string,
  newValue: string
): Promise<void> => {
  await fetch(
    // "https://us-central1-baumann-firebase.cloudfunctions.net/setCalendarEventData",
    "http://localhost:5001/baumann-firebase/us-central1/setCalendarEventData",
    {
      method: "POST",
      body: JSON.stringify({
        calendarEventKey: valueKey,
        calendarEventId: eventId,
        newValue,
      }),
    }
  );
};

const Calendar = (): JSX.Element => {
  const [events, setEvents] = useRecoilState(eventState);
  const [{ isSignedIn, isValid }] = useRecoilState(authState);
  const [eventBeingEdited, setEventBeingEdited] = useState<string | null>(null);

  const handleEventChange = (
    newValue: string,
    valueKey: string,
    eventId: string
  ): void => {
    // debugger;
    setEvents((prevEvents) => ({
      ...prevEvents,
      [eventId]: { ...prevEvents[eventId], [valueKey]: newValue },
    }));
  };

  const renderSingleEvent = ({
    date,
    description,
    name: eventName,
    id,
    imageSrc,
    timeOfDay,
  }: CalendarEvent): JSX.Element => {
    const isEventBeingEdited = eventBeingEdited === id;
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
          {isSignedIn && isValid && (
            <Button
              onClick={() =>
                setEventBeingEdited(isEventBeingEdited ? null : id)
              }
              style={{ backgroundColor: "grey" }}
            >
              Edit
            </Button>
          )}
          <div style={{ fontSize: "35px" }}>
            {isEventBeingEdited ? (
              <TextField
                variant="outlined"
                type="text"
                label={eventName}
                helperText="Name"
                value={eventName}
                onChange={({ target: { value: newValue } }) =>
                  handleEventChange(newValue, "name", id)
                }
                onBlur={({ target: { value: newValue } }) => {
                  writeCalendarEventData(id, "name", newValue);
                }}
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
                  handleEventChange(newValue, "date", id)
                }
                onBlur={({ target: { value: newValue } }) => {
                  writeCalendarEventData(id, "date", newValue);
                }}
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
                  handleEventChange(newValue, "description", id)
                }
                onBlur={({ target: { value: newValue } }) => {
                  writeCalendarEventData(id, "description", newValue);
                }}
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
              <TextField
                style={{ width: "100%" }}
                value={timeOfDay}
                onChange={({ target: { value: newValue } }) =>
                  handleEventChange(newValue, "timeOfDay", id)
                }
                onBlur={({ target: { value: newValue } }) => {
                  writeCalendarEventData(id, "timeOfDay", newValue);
                }}
              />
            ) : (
              timeOfDay
            )}
          </div>
        </div>
        {isEventBeingEdited ? (
          <TextField
            style={{ width: "100%" }}
            value={imageSrc}
            onChange={({ target: { value: newValue } }) =>
              handleEventChange(newValue, "imageSrc", id)
            }
            onBlur={({ target: { value: newValue } }) => {
              writeCalendarEventData(id, "imageSrc", newValue);
            }}
          />
        ) : (
          <img style={{ width: "30%", height: "auto" }} src={imageSrc} alt="" />
        )}
      </div>
    );
  };

  const getFormattedEvents = () =>
    Object.entries(
      groupBy(
        Object.values(events).sort(
          ({ date: dateA }, { date: dateB }) =>
            Date.parse(dateA) - Date.parse(dateB)
        ),
        "month"
      )
    );

  const renderEvents = (): JSX.Element[] =>
    getFormattedEvents().map(([month, eventArray]) => (
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
        {(eventArray as CalendarEvent[]).map((event) =>
          renderSingleEvent(event)
        )}
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
      {Object.values(events).length ? renderEvents() : null}
    </div>
  );
};

export default Calendar;
