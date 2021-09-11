import Ajv from "ajv";


interface IAddAnimatorDate {
    animatorId: number;
    reservedDate: Date;
}

const ajv = new Ajv();

const IAddAnimatorDateValidator = ajv.compile({
    type: "object",
    properties: {
        animatorId: {
            type: "integer",
            minimum: 1
        },
        reservedDate: {
            type: "string",
            pattern: "^([0-9]{4}[-]?((0[13-9]|1[012])[-]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-]?31|02[-]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-]?02[-]?29)$"
        },
        
    },
    required: [
        "animatorId",
        "reservedDate",
    ],
    additionalProperties: false,
});

export { IAddAnimatorDate };
export { IAddAnimatorDateValidator };
