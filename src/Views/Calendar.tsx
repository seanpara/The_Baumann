import React, { useState, ChangeEvent } from "react";
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
import DateFnsUtils from "@date-io/date-fns";
import { useMediaQuery } from "react-responsive";

import { eventState, authState } from "../atoms";
import { storage } from "../firebase";

const months = [
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
];

const groupBy = <K extends string, T extends { [key in K]: string }>(
  objArry: T[],
  keyToGroupBy: K
) =>
  objArry.reduce((mappedObjs: { [key: string]: T[] }, curentObject: T) => {
    mappedObjs[curentObject[keyToGroupBy]] = [
      ...(mappedObjs[curentObject[keyToGroupBy]] ?? []),
      curentObject,
    ];

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
    "https://us-central1-baumann-firebase.cloudfunctions.net/createCalendarEvent",
    // "http://localhost:5001/baumann-firebase/us-central1/createCalendarEvent",
    {
      method: "POST",
      body: JSON.stringify(eventObj),
    }
  ).then((r) => r.json());

const deleteCalendarEvent = async (eventIdToDelete: string): Promise<string> =>
  await fetch(
    "https://us-central1-baumann-firebase.cloudfunctions.net/deleteCalendarEvent",
    //"http://localhost:5001/baumann-firebase/us-central1/deleteCalendarEvent",
    {
      method: "POST",
      body: JSON.stringify({ eventIdToDelete }),
    }
  ).then((r) => r.json());

const Calendar = (): JSX.Element => {
  const [events, setEvents] = useRecoilState(eventState);
  const [{ isSignedIn, isValid }] = useRecoilState(authState);
  const [eventBeingEdited, setEventBeingEdited] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [eventBeingCreated, setEventBeingCreated] = useState<{
    [key: string]: string | File;
  }>({
    date: new Date().toDateString(),
    month: months[new Date().getMonth()],
    description: "",
    name: "",
    imageFile: "",
    timeOfDay: "",
  });

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

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

  const handleImageAsFile = async (
    e: ChangeEvent<HTMLInputElement>,
    eventId: string
  ) => {
    // @ts-ignore
    const image: File | null = e?.target?.files[0];

    if (image) {
      const uploadTask = storage.ref(`/images/${eventId}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapShot) => {
          //takes a snap shot of the process as it is happening
          console.log(snapShot);
        },
        (err) => {
          //catches the errors
          console.log(err);
        },
        () => {
          // gets the functions from storage refences the image storage in firebase by the children
          // gets the download url then sets the image from firebase as the value for the imgUrl key:
          storage
            .ref("images")
            .child(eventId)
            .getDownloadURL()
            .then(async (fireBaseUrl) => {
              const updatedEvent = {
                ...events[eventId],
                imageSrc: fireBaseUrl,
              };
              setEvents((prevEvents) => ({
                ...prevEvents,
                [eventId]: updatedEvent,
              }));

              await writeCalendarEventData(eventId, updatedEvent);
            });
        }
      );
    }
  };

  const handleEventCreate = async () => {
    const { imageFile, ...protoEvent } = eventBeingCreated;

    const newEvent = (await createCalendarEvent({
      ...protoEvent,
      imageSrc: "",
    } as NonFinishedEvent)) as CalendarEvent;

    const uploadTask = storage
      .ref(`/images/${newEvent.id}`)
      .put(imageFile as File);

    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(newEvent.id)
          .getDownloadURL()
          .then(async (fireBaseUrl) => {
            const updatedEvent = {
              ...newEvent,
              imageSrc: fireBaseUrl,
            };

            setEvents((prevEvents) => ({
              ...prevEvents,
              [newEvent.id]: updatedEvent,
            }));

            await writeCalendarEventData(newEvent.id, updatedEvent);
            toggleDialog();
          });
      }
    );
  };

  const renderCreateEventDialog = (): JSX.Element => (
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
                value={new Date(eventBeingCreated[property] as string)}
                onChange={(newDate) => {
                  setEventBeingCreated((prevEv) => ({
                    ...prevEv,
                    [property]: newDate?.toDateString() as string,
                    month: months[newDate?.getMonth() ?? 0],
                  }));
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            ) : property === "imageSrc" ? (
              <Button variant="contained" component="label">
                Upload Image!
                <input
                  type="file"
                  hidden
                  onChange={(event) => {
                    // @ts-ignore
                    const image: File | null = event?.target?.files[0];
                    console.log(image);

                    setEventBeingCreated((p) => ({ ...p, imageFile: image }));
                  }}
                />
              </Button>
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
            disabled={Boolean(
              !CalendarEventProperties.filter((p) => p !== "imageSrc").every(
                (key) => eventBeingCreated[key]
              ) && eventBeingCreated.imageFile
            )}
            onClick={handleEventCreate}
          >
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </div>
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
          marginBottom: isTabletOrMobile ? "5%" : "3%",
          alignItems: "flex-start" /* new */,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "65%",
            justifyContent: "space-between",
            height: "100%",
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
          <div
            style={{
              fontSize: isTabletOrMobile ? "20px" : "35px",
              fontWeight: isTabletOrMobile ? "bold" : "normal",
            }}
          >
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
          <div style={{ fontSize: isTabletOrMobile ? "15px" : "30px" }}>
            {isEventBeingEdited ? (
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM-dd-yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date picker inline"
                autoOk={true}
                value={new Date(date)}
                onChange={(newDate) => {
                  setEvents((prevEvents) => ({
                    ...prevEvents,
                    [id]: {
                      ...prevEvents[id],
                      date: newDate?.toDateString() as string,
                      month: months[newDate?.getMonth() ?? 0],
                    },
                  }));
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            ) : (
              date
            )}
          </div>

          <div
            style={{
              width: "90%",
              alignSelf: "left",
              fontSize: isTabletOrMobile ? "15px" : "25px",
            }}
          >
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
              fontSize: isTabletOrMobile ? "15px" : "25px",
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
          <>
            <Button variant="contained" component="label">
              Upload Image!
              <input
                type="file"
                hidden
                onChange={(event) => handleImageAsFile(event, id)}
              />
            </Button>
          </>
        ) : (
          <img style={{ width: "30%", height: "auto" }} src={imageSrc} alt="" />
        )}
      </div>
    );
  };

  const getFormattedEvents = () =>
    Object.entries(
      groupBy(
        Object.values(events)
          .filter(({ month }) => month)
          .sort(
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
          width: isTabletOrMobile ? "100%" : "auto",
          height: "100%",
        }}
      >
        <div
          style={{
            borderBottom: "solid black",
            width: isTabletOrMobile ? "50vw" : "100%",
            height: "10",
            marginTop: "5%",
            marginBottom: "1%",
            position: "sticky",
            top: "0px",
            zIndex: 1,
            backgroundColor: "#8c9eff",
            cursor: "pointer",
            fontSize: isTabletOrMobile ? "35px" : "70px",
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
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
    </MuiPickersUtilsProvider>
  );
};

export default Calendar;
