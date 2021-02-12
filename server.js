const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const compression = require("compression");

const PORT = process.env.PORT || 3000

const db = require("./models");

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(compression());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
    useNewUrlParser: true
});

// routes
// app.use(require("./routes/routes.js")(app));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, '/public', "index.html")));

app.get("/exercise", (req, res) => res.sendFile(path.join(__dirname, '/public', "exercise.html")));

app.get("/stats", (req, res) => res.sendFile(path.join(__dirname, '/public', "stats.html")));

app.get("/api/workouts", (req, res) => {
    db.Workout.aggregate([
        {
          $addFields: {
            totalDuration: {
              $sum: '$exercises.duration'
            }
          }
        }
      ])
        .then(data => {    
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            res.send(err);
        });
});


app.put('/api/workouts/:id', (req, res) => {

    db.Workout.updateOne(
        {
            _id: req.params.id
        },
        {
            $push: { exercises: req.body }
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err)
        });
});

app.post('/api/workouts', (req, res) => {

    console.log(req.body);
    db.Workout.create({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err)
        });
});

//   app.get('/api/workouts/range', (req, res) => {
//     db.Workout.find({})
//     .then(dbNote => {
//       res.json(dbNote);
//     })
//     .catch(err => {
//       res.json(err);
//     });
//   });





app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
