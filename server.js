const http = require('http');
const cors = require("cors");
const express =require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app =express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/about',express.static('about'));
app.use('/content',express.static('content'));
app.use('/resume',express.static('resume'));
app.use(express.json()); 
const getConnection = require('./confiq/db');
getConnection();

const blogRoutes = require('./routes/blogRoute');

app.use("/blog",blogRoutes);
const ContentRoutes = require('./routes/ContentRoute');
app.use("/content",ContentRoutes);
const ContactRoutes = require('./routes/contactRoute');
app.use("/contact",ContactRoutes);
const CandidateRoutes = require('./routes/condidateRoute');
app.use("/candidate",CandidateRoutes);
const CommentRoutes = require('./routes/commentRouter');
app.use("/comment",CommentRoutes);
const RegisterRoutes = require('./routes/registerRoute');
app.use("/user",RegisterRoutes);

app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d", this.address().port);
  });