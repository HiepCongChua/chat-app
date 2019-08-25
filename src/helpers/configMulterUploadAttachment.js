import multer from 'multer';
const limits = { fileSize: 1024 * 1024 *10};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/images/chat/message');
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname);
    }
  });
const multer_attachment = multer({storage,limits});
module.exports = {
    multer_upload_attachment:(filename)=> multer_attachment.single(filename)
}