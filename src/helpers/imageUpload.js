import multer from "multer";
import { diskStorage, FileFilterCallback } from 'multer';
import Path from "path";
import { v4 as uuidv4 } from "uuid";
import FileSys from 'fs';

/**
 * Regular expression for filetypes
 */
export const filetypes = /jpeg|jpg|png|gif/;

/**
 * Storage location 
 */
export const destination = './public/uploads';

export const imageUrl = "/uploads";

const storage = multer.diskStorage({
    destination: handle_destination,
    filename: handle_filename
});

/**
 * Image uploading service
 */
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10485760
    },
    // fileFilter: (req, file, callback) => {
    //     checkFileType(file, callback);
    // }
});

export function remove_file(path) {
    if (FileSys.existsSync(`./public${path}`)){
        FileSys.unlinkSync(`./public${path}`);
    } else {
        console.warn(`./public/${path} doesn't exist`);
    }
}
function handle_destination(req, file, callback) {
    if (!FileSys.existsSync(destination)) {
        FileSys.mkdirSync(destination, { recursive: true});
    }
    return callback(null, `${destination}/`);
}

/**
 * This function generates name for the file to be stored
 * @param {Express.Request} req 
 * @param {Express.Multer.File} file 
 * @param {function(Error, string)} callback 
 */
function handle_filename(req, file, callback) {
    const filename = uuidv4();
    console.log(`Saving file as ${filename}`);
    return callback(null, filename);
}
/**
 * Filter the file by their extension
 * @param {Express.Request} req incoming http request
 * @param {Express.Multer.File} file incoming file
 * @param {FileFilterCallback} callback Multer's handle 
 */
// function checkFileType(req, file, callback) {
//     const extname = filetypes.test(Path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//         return callback(null, true);
//     } else {
//         callback({"message": "images only!"});
//     }
// }
