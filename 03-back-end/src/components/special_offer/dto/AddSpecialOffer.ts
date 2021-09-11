import Ajv from "ajv";

interface IAddSpecialOffer {
    name: string;
    description: string;
    videoURL: string;
}

const ajv = new Ajv();
//videourl should change after

const IAddSpecialOfferValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        description: {
            type: "string",
            minLength: 2,
            maxLength: 64 * 1024,
        },
        videoURL: {
            type: "string",
            maxLength: 255
        },
    },
    required: [
        "name",
        "description",
        "videoURL",
    ],
    additionalProperties: false,
});

export { IAddSpecialOffer };
export { IAddSpecialOfferValidator };
