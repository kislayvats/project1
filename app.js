var PORT=process.env.PORT ||3000;
var express=require("express");
var app=express();
var mongoose=require("mongoose");
var flash=require("connect-flash");
var bodyparser=require("body-parser");
var User=require("./models/user");
var photo=require("./models/photo");
var passport=require("passport");
var methodoverride=require("method-override");
var localstrategy=require("passport-local");

mongoose.connect("mongodb://localhost:27017/Andafactorydb",{useNewUrlParser:true,useUnifiedTopology: true},function(error,success){
    if(!error){
        console.log("success");
    }
    else{
        console.log("error");
    }
});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodoverride("_method"));
app.use(flash());
mongoose.set("useFindAndModify",false);
app.use(require("express-session")({
    secret:"Andaa",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
// ============
// ROUTES
// ============ 
app.get("/",function(req,res){
    res.render("landing");
});
// =======================
// ADDING PHOTO ROUTES
// =======================
app.get("/photos",function(req,res){
    photo.find({},function(error,photo){
        if(error){
            console.log(error);
            res.redirect("back");
        }
        else{
            res.render("photos",{photo:photo});
        }
    });
});
app.get("/photos/new",isloggedin,function(req,res){
res.render("newphoto");
});
app.post("/photos",isloggedin,function(req,res){
var image=req.body.image;
var arr={image:image};
    photo.create(arr,function(error,photoadded){
     if(error){
         console.log(error);
     }
     else{
         req.flash("success","You Posted A Photo");
         res.redirect("/photos");
     }
 });
});
// ============================
// AUTHENTICATION ROUTES
// ============================


//REGISTER
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
   
    var newuser=new User(
        {
            username:req.body.username,
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            image:req.body.image

        }
        );
        if(req.body.admincode==="secret123"){
            newuser.isAdmin=true;
        }
    User.register(newuser,req.body.password,function(error,user){
        if(error){
            console.log(error);
            req.flash("error",error.message);
            res.redirect("back");
        }
        else{

       passport.authenticate("local")(req,res,function(){
       req.flash("success","You Have Been Registered");
        res.redirect("/");
        console.log(currentuser.username);
       });
        }
    });
});

//LOGIN
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),function(req,res){

});
//LOGOUT
app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","You Have Been Logged Out");
    res.redirect("/");
});
//ISLOGGED IN
function isloggedin(req,res,next){
    if(req.isAuthenticated()){
     return next();
    }
    else{
        req.flash("error","You Are Not Loggedin.Login First.")
        res.redirect("/");
    }
}
// var ashu="AshutoshPathak";
// //CHECKING OWNERSHIP
// var checkownership=function(req,res,next){
//     if(req.isAuthenticated()){
//         if(currentuser && (ashu.equals(currentuser))){
//             next();
//         }
//         else{
//             res.redirect("/photos");
//         }
//     }
// else{
//     res.redirect("/login");
// }
// }

//USER PROFILE
app.get("/users/:id",function(req,res){
    User.findById(req.params.id,function(error,founduser){
        if(error){
            req.flash("error","something went wrong");
            res.redirect("/");
        }
        else{
        res.render("userprofile",{user:founduser});
        console.log(founduser);
        }
    });
});

app.listen(PORT,function(){
    console.log("server started at http://Localhost:3000");
});