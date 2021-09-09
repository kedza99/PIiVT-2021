import Ajv from "ajv";

interface IEditSpecialOffer {
    name: string;
    description: string;
    videoURL: string;
    imagePath: string;
}

const ajv = new Ajv();
//videourl should change after

const IEditSpecialOfferValidator = ajv.compile({
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

        imagePath: {
            type: "string",
            maxLength: 255,
            pattern: "\.(png|jpg)$",
        },
    },
    required: [
        "name",
        "description",
        "videoURL",
        "imagePath",
    ],
    EdititionalProperties: false,
});

export { IEditSpecialOffer };
export { IEditSpecialOfferValidator };