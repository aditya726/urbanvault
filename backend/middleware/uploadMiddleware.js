import multer from 'multer';
import path from 'path';

// Use memory storage to handle files as buffers
const storage = multer.memoryStorage();

// Function to check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only!'), false);
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

export default upload;