export interface UserData {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    gender: string;
    isEmailVerify: boolean;
    notifType: string;
    address: {
        street: string;
        city: string;
        province: string;
        zip_code: string;
    };
}

export interface SessionData {
    user: {
        id: string;
        name: string | undefined;
        email: string;
        role: string;
        username: string;
        isEmailVerify: boolean;
        notifType: string;
    };
}

export interface AppointmentData {
    id: string;
    carBrand: string;
    plateNumber: string;
    carIssue: string;
    chassisNumber: string;
    engineNumber: string;
    appointmentDate: string;
    isExpired: boolean;
    remark: string;
    status: string;
    vehicleModel: string;
    isWalkedIn: boolean;
    walkedInFullName: string;
    mileage: string;
    customer: UserData;
    event: EventData;
}

export type EventData = {
    id: number;
    title: string;
    start: Date;
    end: Date;
    appointments: AppointmentData[];
    allowed: number;
    createdAt: Date;
};
