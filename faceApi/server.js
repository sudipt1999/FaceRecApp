const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');
const { mongoose } = require('./DB/connectDb');
const { User } = require('./DB/Model/User');
const { ObjectID } = require('mongodb');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'banana',
            entries: 0,
            joined: new Date()
        }
    ]

}


app.get('/', (req, res) => {
    User.find().then(users => {
        // console.log("USERS-----", users);
        res.send(JSON.stringify(users));
    })
});


app.post('/signIn', (req, res) => {
    console.log(req);
    const email = req.body.email;
    const password = req.body.password;
    // console.log("EMAIL", email);
    // console.log("password", password);
    User.find({ email: email, password: password }).then((user) => {
        // console.log(user);
        if (user.length > 0) {
            res.json({
                user: user,
                status: "success"
            });
        }
        else {
            res.status(404).json('Not Found');
        }
    }).catch(e => {
        res.status(404).json('Not Found');
    })
});

app.post('/signUp', (req, res) => {
    const { email, name, password } = req.body;
    const date = new Date().toString();
    const newUser = new User({
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: date
    });
    newUser.save().then(user => {
        res.json({
            user: user,
            status: "success"
        });
    })

})


app.get('/profile/:id', (req, res) => {
    const id = req.params.id;
    let found = false;
    // database.users.map((user) => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.status('200').json(user);
    //     }
    // })
    // if (!found) {
    //     res.status("400").send("failure");
    // }
    User.findById(id).then((user) => {
        if (user) {
            return res.status('200').json(user);
        }
        else {
            res.status("400").send("failure");
        }
    }).catch(e => {
        res.status("400").send("failure");
    })

})


app.put('/image', (req, res) => {
    console.log(req);
    const { id } = req.body;
    // let found = false;
    // let foundUser = null;
    // database.users.map((user) => {
    //     if (user.id === id) {
    //         found = true;
    //         foundUser = user;
    //     }
    // })
    // if (!found) {
    //     res.status(404).send("no user such exists");
    // }
    // else {
    //     foundUser.entries = foundUser.entries + 1;
    //     res.status(200).send(JSON.stringify({
    //         user: foundUser,
    //         status: "success"
    //     }));
    // }
    User.findByIdAndUpdate(id,
        {
            $inc: {
                entries: 1
            }
        },
        {
            new: true
        }
    ).then((updatedUser) => {
        console.log("UPDATED USR-------", updatedUser);
        res.status(200).send(JSON.stringify({
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                password: updatedUser.password,
                entries: updatedUser.entries,
                joined: updatedUser.joined
            },
            status: "success"
        }));
    }).catch(e => {
        res.status(404).send("no user such exists");
    })
})


app.listen(3030, () => {
    console.log("Server started at port 3030");
});









/*

    Starting idea endpoints !
    / --> = this is working
    /signin ---> POST respond with succes or fail
    /signup ---> POST = return created user
    /profile/:userId ----> GET = user
    /image -----> PUT ---> updated user info


*/