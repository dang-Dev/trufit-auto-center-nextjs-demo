"use client";

import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
            display: false,
        },
        title: {
            display: false,
            text: "Appointment Schedule",
        },
    },
    scales: {
        y: {
            type: "linear" as const,
            display: true,
            position: "right" as const,
        },
    },
};

type appointmentType = { createdAt: string; status: string };
type DataSetType = { date: string; appointments: number };

export function LineChart({ labels, appointments }: { labels: string[]; appointments: appointmentType[] }) {
    const [data_set, setDataSet] = useState<DataSetType[] | undefined>();
    useEffect(() => {
        const generateData = () => {
            const data = labels.map((e) => {
                let counter = 0;
                appointments.forEach((date) => {
                    const label_date = moment(moment(e).format("YYYY-MM-DD"));
                    const appointment_date = moment(moment(date.createdAt).format("YYYY-MM-DD"));
                    if (label_date.diff(appointment_date, "days") === 0) {
                        counter++;
                    }
                });
                return { date: e, appointments: counter };
            }); 
            setDataSet(data);
        };
        if (labels.length > 0) {
            generateData()
        }
    }, [labels, appointments]);

    const data = {
        labels,
        datasets: [
            {
                label: "Appointment",
                data: data_set?.map((e) => e.appointments),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                fill: true,
                tension: 0.1,
            },
        ],
    };
    return <Line options={options} data={data} />;
}
