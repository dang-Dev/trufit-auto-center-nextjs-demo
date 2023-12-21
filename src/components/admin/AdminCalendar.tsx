"use client";

import { Scheduler } from "@aldabil/react-scheduler";
import { EventActions, ProcessedEvent, RemoteQuery } from "@aldabil/react-scheduler/types";

export default function AdminCalendar() {
    const fetchRemote = async (query: RemoteQuery): Promise<ProcessedEvent[]> => {
        /**Simulate fetching remote data */
        return new Promise((res) => {
            fetch(`/api/event?start=${query.start}&end=${query.end}`, {
                method: "GET",
            })
                .then((data) => {
                    return data.json();
                })
                .then((events) => {
                    const e = events.data.map(
                        (e: { id: number; title: string; start: Date; end: Date; allowed: number, appointments: [] }) => {
                            return {
                                event_id: e.id,
                                title: e.title,
                                start: new Date(e.start),
                                end: new Date(e.end),
                                allowed: e.allowed,
                                seat_occupied: e.appointments.length,
                                color: generateRandomColor(),
                            };
                        }
                    );
                    res(e);
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    };

    const handleConfirm = async (event: ProcessedEvent, action: EventActions): Promise<ProcessedEvent> => {
        console.log("handleConfirm =", action, event.title);
        /**
         * Make sure to return 4 mandatory fields:
         * event_id: string|number
         * title: string
         * start: Date|string
         * end: Date|string
         * ....extra other fields depend on your custom fields/editor properties
         */
        // Simulate http request: return added/edited event
        return new Promise((res, rej) => {
            if (action === "edit") {
                /** PUT event to remote DB */
                fetch("/api/event", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: event.event_id,
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        allowed: event.allowed,
                    }),
                })
                    .then((data) => {
                        return data.json();
                    })
                    .then((new_event) => {
                        console.log(new_event)
                        res({
                            ...event,
                            allowed: new_event.data.allowed,
                            seat_occupied: new_event.data.appointments,
                        });
                    })
                    .catch((e) => {
                        rej(e);
                    });
            } else if (action === "create") {
                /**POST event to remote DB */
                fetch("/api/event", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        allowed: event.allowed,
                    }),
                })
                    .then((data) => {
                        return data.json();
                    })
                    .then((new_event) => {
                        res({
                            ...event,
                            event_id: new_event.id,
                            seat_occupied: new_event.appointments,
                        });
                    })
                    .catch((e) => {
                        rej(e);
                    });
            }
        });
    };
    const handleDelete = async (deletedId: string): Promise<string> => {
        console.log(deletedId);
        // Simulate http request: return the deleted id
        return new Promise((res, rej) => {
            fetch("/api/event", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: deletedId,
                }),
            })
                .then((data) => {
                    return data.json();
                })
                .then(() => {
                    res(deletedId);
                })
                .catch((e) => {
                    rej(e);
                });
        });
    };

    return (
        <Scheduler
            fields={[
                {
                    name: "allowed",
                    type: "input",
                    default: 5,
                    config: { label: "Allowed Customer", decimal: true },
                },
            ]}
            getRemoteEvents={fetchRemote}
            onConfirm={handleConfirm}
            onDelete={handleDelete}
            viewerExtraComponent={(fields, event) => {
                return (
                    <div>
                        {fields.map((field, i) => {
                            return (
                                <div key={field.name} className="mt-2">
                                    <div>Allowed Appointment:{event.allowed} </div>
                                    <div>Seat Occupied: {event.seat_occupied}</div>
                                </div>
                            );
                        })}
                    </div>
                );
            }}
            // getRemoteEvents={fetchRemote} onConfirm={handleConfirm} onDelete={handleDelete}
        />
    );
}

function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

    return color;
}
