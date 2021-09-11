import Ajv from "ajv";

interface IAddReservation {
    clientName: string;
    clientSurname: string;
    clientEmail: string;
    clientPhoneNumber: string;
    postalAddress: string;
    animatorDateId: number;
}

const ajv = new Ajv();

const IAddReservationValidator = ajv.compile({
    type: "object",
    properties: {
        clientName: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        clientSurname: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        clientEmail: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
        clientPhoneNumber: {
            type: "string",
            minLength: 5,
            maxLength: 24,
        },
        postalAddress:{
            type: "string",
            minLength: 10,
            maxLength: 64 * 1024, 
        },
      
        animatorDateId: {
            type: "integer",
            minimum: 1
        },
    },
    required: [
        "clientName",
        "clientSurname",
        "clientEmail",
        "clientPhoneNumber",
        "postalAddress",
        "animatorDateId"
    ],
    additionalProperties: false,
});

export { IAddReservation };
export { IAddReservationValidator };
