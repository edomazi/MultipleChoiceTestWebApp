// app.js
const cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const fs = require('fs')
const utils = require('./utils/utils');
const User = require('./models/userModel.js');
const app = express();
const multer = require('multer');

const port = 3000;

// Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/ecomerce';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/json']
    if(!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorred file");
        error.code = "INCORRECT_FILETYPE";
        return cb(error, false);
    }
    cb(null, true);
}
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace('.json','') + "-" + Date.now() + ".json")
    },
})
const upload = multer({
    fileFilter,
    storage: storage,
    limits: {
        fileSize: 30000000,
    }
});
app.get('/', (req, res) => {
    const fileContent = fs.readFileSync('./allQuiz/homePage/medium.json', 'UTF-8');
    return res.json({
        questions: JSON.parse(fileContent),
    })
});

app.post('/register', [
  check('name').trim().escape(),
  check('email').trim().escape(),
  check('password').trim().escape()
], async (req, res) => {

    const userExists = await User.find({ email: req.body.email });
    if (userExists.length >= 1) {
        return res.json({
            code: 0,
            message: "Email already in use",
        })
    } else {
        let newUser = new User();
        newUser.name= req.body.name;
        newUser.role=  'normal_user';
        newUser.email= req.body.email;
        newUser.password = newUser.generateHash(req.body.password);

        await newUser.save(function (err) {
            if (err) {
                console.log(err)
            }
        })
        return res.json({
            code: 1,
            message: 'You have been registered successfully'
        })
    }
})
app.post('/login',[
    check('email').trim().escape(),
    check('password').trim().escape()
], async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    const usr = new User(userExists)
    if (userExists && usr.validPassword(req.body.password)) {
        return res.json({
            code: 1,
            token: utils.encrypt(usr._id.toString())
        })
    } else {
        return res.json({
            code: 0,
            message: 'Oops! Email or password incorrect',
        })
    }
})
app.post('/getQuiz', (req, res) => {
    if (isSignedIn(utils.decrypt(req.body.token))) {
        const quizFolder = req.body.quizName.replace(" ", "-")
        let quizName = "/" + req.body.quizDifficulty + '.json';
        const fileContent = fs.readFileSync('./allQuiz/' + quizFolder + quizName, 'UTF-8');
        let finalRes = [];

        JSON.parse(fileContent).forEach((item, index) => {
            finalRes[index] = item;
            finalRes[index].question = utils.encrypt(item.question)
            finalRes[index].correct_answer = utils.encrypt(item.correct_answer);
        })
        return res.json({
                questions: finalRes,
        })
    } else {
        return res.json({
            code: 0,
            message: 'Oops! Email or password incorrect',
        })
    }
})
app.post('/getProfile', async (req, res, next) => {
    if (isSignedIn(utils.decrypt(req.body.token))) {
        await User.findById(utils.decrypt(req.body.token), function (err, user) {
            if (err) return res.json({
                code: 0,
                message: 'Something went wrong!',
            });
            res.json({
                user: user,
            });
        })
    } else {
        return res.json({
            code: 0,
            message: 'Something went wrong!',
        })
    }
});


app.post('/saveQuizResults', async (req, res) => {
    if (isSignedIn(utils.decrypt(req.body.token))) {
        const quizResults = {
            quizName: req.body.quizName,
            quizDifficulty: req.body.quizDifficulty,
            percentage: req.body.percentage,
        }
        await User.findByIdAndUpdate(utils.decrypt(req.body.token),
          { $push: { quizResults: quizResults} },
          { upsert: true, new: true});
    } else {
        return res.json({
            code: 0,
            message: 'Something went wrong!',
        })
    }
});

app.post('/getAllUsers', async (req, res) => {
    if (isSignedIn(utils.decrypt(req.body.token))) {
        User.find({}, (err, users) => {
            res.json({
                allUsers: users
            });
        });
    } else {
        return res.json({
            code: 0,
            message: 'Something went wrong!',
        })
    }
});

app.post('/uploadFile', upload.single('file'), (req, res) => {
    return res.json({
        "message": "File uploaded successfilly"
    })
});

app.post('/getUploadedFiles', (req, res) => {
    if (isSignedIn(utils.decrypt(req.body.token))) {
        const files = fs.readdirSync('./uploads');
        return res.json({
            allFiles: files
        })
    } else {
        return res.json({
            code: 0,
            message: 'Something went wrong!',
        })
    }
});

app.post('/getFileUpdatedContent', (req, res) => {
    if (isSignedIn(utils.decrypt(req.body.token))) {
        const fileContent = fs.readFileSync('./uploads/' + req.body.fileName, 'UTF-8');
        let finalRes = [];

        JSON.parse(fileContent).forEach((item, index) => {
            finalRes[index] = item;
            finalRes[index].question = utils.encrypt(item.question)
            finalRes[index].correct_answer = utils.encrypt(item.correct_answer);
        })
        return res.json({
            questions: finalRes
        })
    } else {
        return res.json({
            code: 0,
            message: 'Something went wrong!',
        })
    }
})

app.post('/deleteFile', (req, res) => {
    if (isSignedIn(utils.decrypt(req.body.token))) {
        fs.unlinkSync('./uploads/' + req.body.fileName);
        return res.json({
            message: "Quiz removed successfully"
        })
    } else {
        return res.json({
            code: 0,
            message: 'Something went wrong!',
        })
    }
})
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

async function isSignedIn(id) {
    const user = await User.findById(id);
    return user.length >= 1;
}
