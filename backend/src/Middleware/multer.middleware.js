import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    const uploadPath = path.join(process.cwd(), "public", "temp");
    callBack(null, uploadPath);
  },

  filename: function (req, file, callBack) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFilename = file.filename + "-" + uniqueSuffix;
    callBack(null, newFilename);
  },
});

export const upload = multer({ storage: storage });
