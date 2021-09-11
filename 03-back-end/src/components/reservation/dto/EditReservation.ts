import Ajv from "ajv";

interface IEditReservation {
    clientName: string;
    clientSurname: string;
    clientEmail: string;
    clientPhoneNumber: string;
    postalAddress: string;
}

const ajv = new Ajv();

const IEditReservationValidator = ajv.compile({
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
    },
    required: [
        "clientName",
        "clientSurname",
        "clientEmail",
        "clientPhoneNumber",
        "postalAddress",
    ],
    additionalProperties: false,
});

export { IEditReservation };
export { IEditReservationValidator };
