import multer from 'multer';
const limits = { fileSize: 1024 * 1024}
function fileFilter(req, file, cb) {
    if ((file.mimetype!=="image/png")&&(file.mimetype!=="image/jpg")&&(file.mimetype!=="image/jpeg")) {
        const error = new Error();
        error.code = 'IMAGE_MESSAGE_TYPE';
        return cb(error);
    }
    cb(null, true);
}
const upload_image = multer({fileFilter,limits});
module.exports = {
    multer_upload_image:(image)=> upload_image.single(image)
}