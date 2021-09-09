import Ajv from "ajv";

interface IAddAnimator {
    name: string;
    surname: string;
    nickname: string;
    description: string;
    price:number;
    specialOfferId: number;
}

const ajv = new Ajv();

const IAddAnimatorValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        surname: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        nickname: {
            type: "string",
            minLength: 2,
            maxLength: 40,
        },
        description: {
            type: "string",
            minLength: 2,
            maxLength: 64 * 1024,
        },
        price:{
            type: "number",
            minimum: 1 
        },
      
        specialOfferId: {
            type: "number",
            minimum: 1
        },
    },
    required: [
        "name",
        "surname",
        "nickname",
        "description",
        "price",
        "specialOfferId"
    ],
    additionalProperties: false,
});

export { IAddAnimator };
export { IAddAnimatorValidator };
