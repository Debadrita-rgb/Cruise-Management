const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://cruise-management-frontend.onrender.com"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.text()); 

const PORT = process.env.PORT || 5000;

// Routes
const adminRoutes = require('./routes/adminRoutes');
const voyagerRoutes = require("./routes/voyagerRoutes");
const managerRoutes = require("./routes/managerRoutes");
const headcookRoutes = require("./routes/headcookRoutes");
const supervisorRoutes = require("./routes/supervisorRoutes");
const commonRoutes = require("./routes/commonRoutes");

app.use('/admin', adminRoutes);  
app.use("/voyager", voyagerRoutes);  
app.use("/manager", managerRoutes);  
app.use("/headcook", headcookRoutes);  
app.use("/supervisor", supervisorRoutes);  
app.use("/common", commonRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on port 5000`);
})