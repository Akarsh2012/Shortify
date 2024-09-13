const express = require("express");
const { connectToMongoDb } = require("./connection");
const {checkForAuthentication,
  restrictTo}=require('./middlewares/auth');
const cookieParser = require("cookie-parser");


const path=require('path');
const URL = require("./models/url");

const urlRouter = require("./routes/url");
const staticRoute=require('./routes/staticRouter');
const userRoute=require('./routes/user');


const app = express();
const PORT = 8001;

connectToMongoDb("mongodb+srv://Akarsh:Akarsh2211@cluster0.v5wwq.mongodb.net/short-url?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error while Connecting MongoDB:", err));



  // telling express that we are using EJS view engine for SSR
  // in views folder we can make ejs files   
  app.set("view engine", "ejs");

// telling express that we have kept the ejs files in views folder
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthentication);

// //testing SSR
// app.get('/test',async (req,res)=>{

//     const allUrls=await URL.find({});
//     return res.render('home',{
//         urls:allUrls,
//     });

// });

app.use("/url",restrictTo(["NORMAL","ADMIN"]),urlRouter);
app.use('/user',userRoute);
app.use('/',staticRoute);

// creating shortId
app.get("/url/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    // Find the entry and update it
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: { visitHistory: { timestamp: Date.now() } },
      },
      { new: true } // Return the updated document
    );

    // If no entry is found, send a 404 response
    if (!entry) {
      return res.status(404).send('URL not found');
    }

    // Redirect to the stored URL
    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal server error');
  }
});


app.listen(PORT, () => console.log(`Server started at: http://localhost:${PORT}/shortify`));
