const connection = require('./connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const book = require('./comments');
dotenv.config();
const jwt_secret = process.env.jwt_secret;
let register_user = (req, res) => {
        let user_name = req.body.user_name;
        let user_email = req.body.user_email;
        let user_pass = req.body.user_pass;
        let register_as = req.body.register_as; // 1 = commenter, 2 =blogger
        bcrypt.hash(user_pass, 10, function (err, user_pass) {
            if (err) {
                res.status(500).send({
                    message: err
                })
            }
            else {
                let insert_sql = "INSERT INTO tb_users (user_name,user_email,user_password,user_role) VALUES (?,?,?,?)";
                connection.query(insert_sql, [user_name, user_email, user_pass, register_as], (err, result) => {
                    if (err) {
                        res.status(412).send({
                            message: err.sqlMessage
                        })
                    }
                    else {
                        res.status(200).send({
                            message: "Success, Please signin to verify",
                            user_id: result.insertId
                        })

                    }

                })
            }
        })
    
}
exports.register_user = register_user;

let user_sign_in = (req,res)=>{
    let user_email = req.body.user_email;
    let user_pass = req.body.user_pass;
    let select_sql = "SELECT * from tb_users WHERE user_email = ?";
    connection.query(select_sql,[user_email],(err,result)=>{
        if(err){
            res.status(412).send({
                message : err.sqlMessage
            })
        }
        else if(result[0].user_role == 1 && result[0].status == 0){ // 0 = banned, 1 = eligible user
            res.status(412).send({
                message : "Commenter is banned from using the service"
            })
        }
        else{
            bcrypt.compare(user_pass, result[0].user_password, function(err, match_result) {
                if(err){
                    res.status(401).send(err);
                }
                else{
                    let update_sql = "UPDATE tb_users set logged_in = 1 WHERE user_id = ?";
                    connection.query(update_sql,[result[0].user_id],(err,update_result)=>{
                        if(err || update_result.affectedRows == 0){
                            res.status(412).send({
                                message : "User login is failed, please try again"
                            })
                        }
                    })
                    let token = jwt.sign({
                        id : result[0].user_id,
                        role : result[0].user_role
                    },jwt_secret,{
                        expiresIn: 86400 
                    });
                    res.status(200).send({
                        message : "success",
                        token : token,
                        user_id : result[0].user_id
                    })
                }
            });
        }
    })
}
exports.user_sign_in = user_sign_in;



let create_profile= (req,res)=>{
    if(req.headers['role'] != 1 || req.headers['role'] != 2 ){
        res.send(401).send({message: "Unauthorized to access the API"})
    }
    console.log(req.file);
    if(!req.file) {
      res.status(500).send({message : "Image file is required"});
    }
    console.dir( req.headers);
    let fileUrl= 'http://localhsot:3000/images/' + req.file.filename;
    let user_id = req.headers['user_id'];
    let update_sql = "UPDATE tb_users set profile_image = ? WHERE user_id = ?";
    connection.query(update_sql,[fileUrl,user_id],(err,result)=>{
        if(err){
            res.status(412).send({
                message : err.sqlMessage
            })
        }
        else{
            res.status(200).send({message: "Profile image successfuly added"});
        }
    })
};
exports.create_profile = create_profile;

