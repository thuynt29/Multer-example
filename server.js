const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        dir = './uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        let fileName = file.originalname;
        console.log(fileName);

        let arr =  fileName.split('.');
        let newFilename = arr[0] + '-' + Date.now()+ '.'+ arr[1];

        cb(null, newFilename);
    }
})

var upload = multer({ storage: storage, limits: { fileSize: 1*1024*1024 } })

let uploadSingleFile = upload.single('myFile', (err) => {

    if (err instanceof multer.MulterError) {
        console.log('Dung luong file qua lon! Hay thu lai!');
    }
});
app.post('/uploadfile', uploadSingleFile, (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

app.post("/upload/photo", upload.single('myImage'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const err = new Error("Please choose files");
      return next(err);
    }else if (file.mimetype != "image.jpeg"){
        res.send("File is not jpeg file")
    }
    res.send("Upload success!");
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});