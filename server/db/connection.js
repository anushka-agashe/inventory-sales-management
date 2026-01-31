const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connection Established !");
})
.catch((err)=>{
    console.log(`Error : ${err}`);
});

