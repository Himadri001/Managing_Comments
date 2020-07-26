const connection = require('./connection');



var check_blog = function (blog_id,callback){
   // console.log(author_id);
   var blog_exists = 0;
    let select_sql = "SELECT * FROM tb_blogs where blog_id = ?";
    connection.query(select_sql,[blog_id],(err,result)=>{
        if(err) {
            callback({message : err.sqlMessage},null);
        }
        else if(result.length == 0 || result[0].allow_comment == 0){
             callback({message : "Blog does not exist or author turned off commenting"},null);
        }
        else{
            blog_exists = 1;
            callback(null,blog_exists);
        }
       
    });
    
}
exports.check_blog = check_blog;


let mark_commenter = (req,res)=>{
    if(req.headers['role'] != 2){
        res.status(401).send({
            message : "Unauthorized to acess the API"
        })
    }
    else if(req.body.logged_in && req.body.logged_in == 1){
        res.status(412).send({
            message : "You need to login to do the operation"
        })
    }
    else if(req.body.spammer == 0){
        res.status(412).send({
            message : "invalid value zero is sent as spammer parameter, send one to complete the operation"
        })
    }
    else{
        let insert_sql = "INSERT INTO tb_spammers (commentor_id,blogger_id) VALUES (?,?)";
        connection.query(insert_sql,[req.body.commenter_id,req.headers['user_id']],(err,insert_result)=>{
            if(err){
                res.status(412).send({
                    message : err.sqlMessage
                })
            }
            else if(!insert_result.inserId){
                res.status(412).send({
                    message : "Failed to perform the operation, please try again later"
                })
            }
            else{
                let select_spammer = "SELECT count(id) FROM tb_spammers WHERE commenter_id = ? AND valid = ?";
                connection.query(select_spammer,[req.body.commenter_id,0],(err,count_result)=>{
                    if(err){
                        res.status(412).send({
                            message : err.sqlMessage
                        }) 
                    }
                    else if(count_result.length >= 2){
                        let ban_commenter = "UPDATE tb_users SET status = 1 WHERE user_id = ? and user_role = ?";
                        connection.query(ban_commenter,[req.body.commenter_id,1],(err,result)=>{
                            if(err){
                                res.status(412).send({
                                    message : err.sqlMessage
                                })
                            }
                            else if(result.affectedRows == 0){
                                res.status(412).send({
                                    message : "Failed to mark commenter as banned commenter"
                                })
                            }
                            else{
                                res.status(200).send({
                                    message : "Success in marking commenter as spammer"
                                })
                            }
                        })
                    }
                    else{
                        res.status(200).send({
                            message : "Success in marking commenter as spammer"
                        })
                    }
                })
            }
        })
    }
}

exports.mark_commenter = mark_commenter;

let delete_comment_of_a_commenter = (req,res)=>{
    if(req.headers['role'] != 2){
        res.status(401).send({
            message : "Unauthorized to acess the API"
        })
    }
    else if(req.body.logged_in && req.body.logged_in == 1){
        res.status(412).send({
            message : "You need to login to do the operation"
        })
    }
    else{
        get_blogs(req.headers['user_id'],(err,blogs)=>{
            if(err){
                res.status(412).send({
                    message : err
                })
            }
            else{
                let delete_comments = "DELETE FROM tb_comments WHERE blog_id IN (?) AND commenter_id = ?";
                connection.query(delete_comments,[blogs,req.body.commenter_id],(err,result)=>{
                    if(err){
                        res.status(412).send({
                            message : err.sqlMessage
                        })
                    }
                    else {
                        res.status(200).send({
                            message : "All comments are deleted"
                        })
                    }

                })
            }
        })
    } 
}

exports.delete_comment_of_a_commenter = delete_comment_of_a_commenter;
let get_blogs = (blogger_id,callback)=>{
    if(blogger_id){
        let get_all_blogs = "SELECT id FROM tb_blog WHERE blogger_id=?";
        connection.query(get_all_blogs,[blogger_id],(err,result)=>{
            if(err || result.length == 0){
                callback(err.sqlMessage ||{message : "No blogs found"}, null);
            }
            else{
                let blogs = result.join(",")
                callback(null,blogs)
            }
        })
    }
}
exports.get_blogs = get_blogs;


