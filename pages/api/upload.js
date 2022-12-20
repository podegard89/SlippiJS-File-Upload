import fs from "fs";
import formidable from "formidable";
import { SlippiGame } from "@slippi/slippi-js";

const checkNotSLPFile = (file) => {
    return file.originalFilename.slice(-3) !== 'slp';
}

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    const form = formidable();
    // formidable not reading multiple files coming request
    // request is definitely sending multiple items
    // Single file works!
    // form.multiples = true;
    form.parse(req, async (err, fields, files) => {
        if (!files.slpFile || checkNotSLPFile(files.slpFile)) {
            res.status(400).send("No file uploaded or wrong file type");
            return;
        }

        try {
            const game = new SlippiGame(files.slpFile.filepath);
            console.log(game.getMetadata());
            console.log(game.getWinners());
            res.status(201).send("File upload");
        } catch (e) {
            console.log(e);
            res.status(500).send("Error uploading file");
        }
    })
}