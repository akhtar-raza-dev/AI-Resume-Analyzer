const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://pareeknitin707_db_user:fCKIwdGOdrOWtW85@cluster0.8449b5h.mongodb.net/?appName=Cluster0').then((res)=>{
    console.log("Database Connected Successfully");
}).catch(err=>{
    console.log("Something Error",err);
})