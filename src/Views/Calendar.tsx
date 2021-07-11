import React, { useState } from "react";
import { useRecoilState } from "recoil";
import {
  Button,
  TextareaAutosize,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";

import { eventState, authState } from "../atoms";

const groupBy = <K extends string, T extends { [key in K]: string }>(
  objArry: T[],
  keyToGroupBy: K
) =>
  objArry.reduce((mappedObjs: { [key: string]: T[] }, curentObject: T) => {
    if (curentObject[keyToGroupBy]) {
      (mappedObjs[curentObject[keyToGroupBy]] =
        mappedObjs[curentObject[keyToGroupBy]] ?? []).push(curentObject);
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

const CalendarEventProperties = [
  "date",
  "month",
  "description",
  "name",
  "imageSrc",
  "timeOfDay",
];

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
  newEventData: CalendarEvent
): Promise<void> => {
  await fetch(
    "https://us-central1-baumann-firebase.cloudfunctions.net/setCalendarEventData",
    // "http://localhost:5001/baumann-firebase/us-central1/setCalendarEventData",
    {
      method: "POST",
      body: JSON.stringify({
        calendarEventId: eventId,
        newEventData,
      }),
    }
  );
};
type NonFinishedEvent = Omit<CalendarEvent, "id">;
const createCalendarEvent = async (
  eventObj: NonFinishedEvent
): Promise<CalendarEvent> =>
  await fetch(
    // "https://us-central1-baumann-firebase.cloudfunctions.net/createCalendarEvent",
    "http://localhost:5001/baumann-firebase/us-central1/createCalendarEvent",
    {
      method: "POST",
      body: JSON.stringify(eventObj),
    }
  ).then((r) => r.json());

const deleteCalendarEvent = async (evenIdToDelete: string): Promise<string> =>
  await fetch(
    "https://us-central1-baumann-firebase.cloudfunctions.net/createCalendarEvent",
    // "http://localhost:5001/baumann-firebase/us-central1/deleteCalendarEvent",
    {
      method: "POST",
      body: JSON.stringify(evenIdToDelete),
    }
  ).then((r) => r.json());

const Calendar = (): JSX.Element => {
  const [events, setEvents] = useRecoilState(eventState);
  const [{ isSignedIn, isValid }] = useRecoilState(authState);
  const [eventBeingEdited, setEventBeingEdited] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [eventBeingCreated, setEventBeingCreated] = useState<{
    [key: string]: string;
  }>({
    date: new Date().toDateString(),
    month: "",
    description: "",
    name: "",
    imageSrc: "",
    timeOfDay: "",
  });

  const handleEventChange = (
    newValue: string,
    valueKey: string,
    eventId: string
  ): void => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [eventId]: { ...prevEvents[eventId], [valueKey]: newValue },
    }));
  };

  const toggleDialog = (): void => {
    setIsCreateDialogOpen((o) => !o);
  };

  const renderCreateEventDialog = (): JSX.Element => (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        <Button
          variant="outlined"
          style={{ color: "black" }}
          onClick={toggleDialog}
        >
          Create Event
        </Button>
        <Dialog open={isCreateDialogOpen} onClose={toggleDialog}>
          <DialogTitle>Make An Event</DialogTitle>
          <DialogContent>
            <DialogContentText>Make An Event Below!</DialogContentText>
            {CalendarEventProperties.map((property) =>
              property === "date" ? (
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM-dd-yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  autoOk={true}
                  value={new Date(eventBeingCreated[property])}
                  onChange={(newDate) => {
                    setEventBeingCreated((prevEv) => ({
                      ...prevEv,
                      [property]: newDate?.toDateString() as string,
                    }));
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              ) : property === "month" ? (
                <Autocomplete
                  id="combo-box-demo"
                  options={[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ]}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Month" variant="outlined" />
                  )}
                />
              ) : (
                <TextField
                  label={property}
                  required
                  value={eventBeingCreated[property]}
                  type="text"
                  fullWidth
                  onChange={({ target: { value } }) => {
                    setEventBeingCreated((prevEv) => ({
                      ...prevEv,
                      [property]: value,
                    }));
                  }}
                />
              )
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleDialog}>Cancel</Button>
            <Button
              disabled={
                !CalendarEventProperties.every((key) => eventBeingCreated[key])
              }
              onClick={async () => {
                const newEvent = (await createCalendarEvent(
                  eventBeingCreated as NonFinishedEvent
                )) as CalendarEvent;
                setEvents((p) => ({ ...p, [newEvent.id]: newEvent }));
                toggleDialog();
              }}
            >
              Create Event
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </MuiPickersUtilsProvider>
  );

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
            <>
              <Button
                onClick={async () => {
                  setEventBeingEdited(isEventBeingEdited ? null : id);

                  if (isEventBeingEdited) {
                    await writeCalendarEventData(id, events[id]);
                  }
                }}
                style={{ backgroundColor: "grey" }}
              >
                {/* TO DO: SUBMIT DATA ON SUBMIT!*/}
                {isEventBeingEdited ? "Submit" : "Edit"}
              </Button>
              {isEventBeingEdited && (
                <Button
                  onClick={() => {
                    deleteCalendarEvent(id);
                    setEventBeingEdited(null);
                    setEvents((prevEvents) => {
                      const { [id]: eToRemove, ...rest } = prevEvents;

                      return rest;
                    });
                  }}
                  style={{ backgroundColor: "red" }}
                >
                  DELETE
                </Button>
              )}
            </>
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
      {isSignedIn && isValid && renderCreateEventDialog()}
      {Object.values(events).length !== 0 && renderEvents()}
    </div>
  );
};

export default Calendar;
