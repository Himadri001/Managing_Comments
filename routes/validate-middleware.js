const validator = require('../helpers/validate');


const user_signup = (req,res,next)=>{
    const validationRule = {
        "user_name": "required|string",
        "user_email": "required|email",
        "user_pass" : "required|string",
        "register_as" : "required| number"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });
}
exports.user_signup = user_signup;



const user_signin = (req,res,next)=>{
    const validationRule = {
        "user_email": "required|email",
        "user_pass" : "required|string"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });
}
exports.user_signin = user_signin;

const create_profile = (req,res,next)=>{
    const validationRule = {
        "user_name": "required|email",
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });  
}
exports.create_profile = create_profile;

const create_comment = (req,res,next)=>{
    const validationRule = {
        "blog_id": "required|integer",
        "commenter_id" : "required|integer",
        "comment" : "required | string"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });  
}
exports.create_comment = create_comment;

const manage_comments = (req,res,next)=>{
    const validationRule = {};
    if(req.body.action_id && req.action_id ==1){
        
        validationRule.action_id = "required|integer";
        validationRule.commenter_id = "required|integer";
        
    }
    else if(req.body.action_id == 2){
        
        validationRule.action_id = "required|integer";
        validationRule.commenter_id = "required|integer";
        validationRule.comment_id = "required|integer";
        validationRule.edited_comment =  "required | string";
        
    }
    else{
        validationRule.action_id = "required|integer";
        validationRule.commenter_id = "required|integer";
        validationRule.comment_id = "required|integer";

    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });  
}
exports.manage_comments = manage_comments;


const react_to_a_comment = (req,res,next)=>{
    const validationRule = {
        "comment_id": "required|integer",
        "reactor_id" : "required|integer",
        "vote" : "required | integer"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });  
}
exports.react_to_a_comment = react_to_a_comment;

const mark_commenter = (req,res,next)=>{
    const validationRule = {
        "commenter_id": "required|integer",
        "spammer" : "required|integer",
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });  
}
exports.mark_commenter = mark_commenter;

const delete_comment_of_a_commenter = (req,res,next)=>{
    const validationRule = {
        "commenter_id": "required|integer",
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    });   
}
exports.delete_comment_of_a_commenter = delete_comment_of_a_commenter;

