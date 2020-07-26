var express         = require('express');
var http            = require('http');
var https           = require('https');
const bodyParser = require('body-parser');
const jwt = require('./routes/jswt_auth');
const comments = require('./routes/comments');
const connection= require('./routes/connection');
const data_validation = require('./routes/validate-middleware');
const users = require('./routes/users');
const blog = require('./routes/blog');
const multer = require('multer')

const app = express();
const port = 3000
const dotenv = require('dotenv');
dotenv.config();
// var multipartMiddleware = multipart({
//     maxFilesSize: 16 * 1024 * 1024 // 16 mb
// });
//--------- block of code upload images of users starts ---------------
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './routes/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});
// -----------------image upload block ends here -------------------------
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var time = new Date();
    time.setMilliseconds(time.getMilliseconds()+ 5.5*60*60*1000);
    console.log('Time:', time.toString());
    console.log(req.body);
    next();
});

app.get('/jwt_token', jwt.jwt_sign);
/*
------------ commenters / bloggers registraion and sign in api API ----------------------------
*/

app.post('/register_user', data_validation.user_signup, users.register_user); // register as user

app.post('/user_sign_in',  data_validation.user_signin, users.user_sign_in)//  the api will return new token if user token is expired

app.post('/create_profile', jwt.verifyToken, data_validation.create_profile, upload.single('file'),   users.create_profile);//  to create profile with profile image  for commenters and bloggers
/*
------------ comment API ------------------------------------
*/
app.post('/create_comment', jwt.verifyToken, data_validation.create_comment, comments.create_comment); // api to post comment on blogs that uses our service

app.post('/manage_comments', jwt.verifyToken, data_validation.manage_comments, comments.manage_comments); // the api to show,edit,delete comment of a commenter. In case of delete and edit the commenter can delete or edit one comment at a time. In request body action_id -> 1 = show comments of a commenter, 2= edit comment, 3 = delete a comment

app.post('/react_to_a_comment', jwt.verifyToken, data_validation.react_to_a_comment, comments.react_to_a_comment); // api to up vote or down vote to others comment. In request body vote -> 1 = up vote, 2 = down vote


/*
-------------------- bloggers API -----------------------------------------
*/

app.post('/mark_commenter_as_spammer', jwt.verifyToken, data_validation.mark_commenter, blog.mark_commenter); // to mark commenter as spammer. In req body spammer -> 1 = marking as spammer

app.post('/delete_comment_of_a_commenter', jwt.verifyToken, data_validation.delete_comment_of_a_commenter, blog.delete_comment_of_a_commenter);

app.post('/stop_comments', jwt.verifyToken, data_validation.stop_comments, blog.stop_comments);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
