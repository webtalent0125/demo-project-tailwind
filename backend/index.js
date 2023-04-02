require("dotenv").config();
const express = require("express");
const sharp = require("sharp");
const cors = require("cors");
const multer = require("multer");
const { initializeApp } = require("firebase/app");
const { getStorage, ref, deleteObject } = require("firebase/storage");
const config = require("./firebase-config.json");

const app = express();
const bodyParser = require("body-parser");
const { Storage } = require("@google-cloud/storage");
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: './service-account-credentials.json',
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.get("/", async (req, res) => {
  const [files] = await bucket.getFiles();

  res.status(200).send({
    state: "success",
    data: files,
  });
});

app.post("/api/upload", uploader.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    // -------------uploading file start------------------------------------------
    // This is where we'll upload our file to Cloud Storage
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    // If there's an error
    blobStream.on("error", (err) => next(err));
    // If all is good and done
    blobStream.on("finish", () => {
      // Assemble the file public URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`;
      // Return the file name and its public URL
      // for you to store in your own database
      res.status(200).send({
        fileName: req.file.originalname,
        fileLocation: publicUrl,
      });
    });
    // When there is no more data to be consumed from the stream the end event gets emitted
    const uploadFile = await sharp(req.file.buffer)
      .resize(200, 200, { fit: "inside" })
      .toBuffer();
    blobStream.end(uploadFile);
    // -------------uploading file end------------------------------------------
  } catch (error) {
    res.status(400).send(`Error, could not upload file: ${error}`);
    return;
  }
});

app.post("/api/delete", (req, res) => {
  const fileUrl = req.body.data.name;
  const app = initializeApp(config);
  const fireBasestorage = getStorage(app);
  const imageRef = ref(fireBasestorage, fileUrl);

  deleteObject(imageRef)
    .then(() => {
      res.status(200).send({ state: true });
    })
    .catch((error) => {
      res.status(200).send({ state: false });
    });
});

app.listen(port, () =>
  console.log(`File uploader API listening on port ${port}`)
);
