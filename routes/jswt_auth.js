const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('./connection');
const dotenv = require('dotenv');
dotenv.config();
const jwt_secret = process.env.jwt_secret;
let jwt_sign = function (user_id, role) {
  var token = jwt.sign({
    id: user_id,
    role : role,
  }, jwt_secret, {
    expiresIn: 86400 // expires in 24 hours
  });
return token; 
};
exports.jwt_sign = jwt_sign;


let verifyToken = function (req, res, next) {

  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  } else {
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({
      auth: false,
      message: 'No token provided.'
    });

    jwt.verify(token, jwt_secret, function (err, decoded) {
     
      if (err) return res.status(401).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
      req.headers['role'] = decoded.role;
      req.headers['user_id'] = decoded.id;
      let check_user_status = "SELECT * from tb_users WHERE user_id= ?";
      connection.query(check_user_status,[decoded.id],(err,result)=>{
        if(err){
          res.status(401).send({
            message : "error in finding user"
          })
        }
        else{
          req.body.status = result[0].status;
          req.body.logged_in = result[0].logged_in;
          next()
        }
      })
    });
  }

};
exports.verifyToken = verifyToken;