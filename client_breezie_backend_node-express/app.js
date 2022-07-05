const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const cron = require("node-cron");
var fs = require('fs');

//Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Logger
const winston = require('winston');
const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    label,
    prettyPrint
} = format;

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'error.log'
        })
    ]
});




//mongodb connection imports
require("./config/db");

const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
//cors middleware
app.use(
    cors({
        origin: [
            "*",
            "**",
            "https://breazie.com",
            "https://app.breazie.com",
            "https://secure.breazie.com",
            "https://admin.breazie.com",
            "http://localhost:4200",
            "http://localhost:5600",
            "http://localhost:5100",
            "http://localhost:8100",
            "http://localhost:8101",
            "http://localhost:",
            "capacitor://localhost",
            "ionic://localhost",
            "http://localhost",
            "*",
            "**",
            "http://10.10.30.204:4200",
            "http://10.10.30.204:5100",
            "http://10.10.30.204:5200",
            "http://10.10.30.204:8101"
        ],
    })
);
app.use(
    express.urlencoded({
        extended: false,
        limit: "20mb",
    })
);
app.use(
    express.json({
        limit: "20mb",
    })
);

app.use(express.static(__dirname + "/public"));
app.use("/images", express.static("images"));

const visitor = require("./routers/visitor-router");

const visitorDevice = require("./routers/visitor-by-device-router");

const admin = require("./routers/login-router");

const employee = require("./routers/employee-router");

const screen = require("./routers/screens-router");

const setting = require("./routers/settings-router");

const preregister = require("./routers/preregister-router");

const devicelocation = require("./routers/devicelocation-router");

const account = require("./routers/account-router");

const register = require("./routers/register-router");

const agreement = require("./routers/agreement-router");

const planandpricing = require("./routers/plansandpricing-router");

const delivery = require("./routers/delivery.router");

const timeline = require("./routers/timeline-router");

const catering = require("./routers/catering-router");

const payment = require("./routers/payment-router");

const superAdmin = require("./routers/super-admin-routes");

const website = require("./routers/website-router");

app.use("/visitor", visitor);

app.use("/visitor-device", visitorDevice);

app.use("/admin", admin);

app.use("/employee", employee);

app.use("/screen", screen);

app.use("/setting", setting);

app.use("/register", register);

app.use("/preregister", preregister);

app.use("/devicelocation", devicelocation);

app.use("/account", account);

app.use("/agreement", agreement);

app.use("/plansandpricing", planandpricing);

app.use("/delivery", delivery);

app.use("/timeline", timeline);

app.use("/catering", catering);

app.use("/payment", payment);

app.use("/superadmin", superAdmin);

app.use("/website", website);

const Visitor = require("./model/visitor-model");
const Setting = require("./model/settings.model");
const Employee = require("./model/employee-model");
const Timeline = require("./model/timeline-model");

cron.schedule(
    // " */10 * * * * *",
    "0 0 */1 * * *",
    () => {
        // Employeelogout();
        // logout();
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata",
    }
);

// Sat Feb 19 2022 23:59:59 GMT+0530 (India Standard Time)
async function logout(req, res, next) {
    const settingsData = await Setting.find({
        "visitorSetting.automaticallySignOut.isSignedOut": true

    });
    const userIds = settingsData.map((val) => {
        return {
            id: val.userId,
            time: val.visitorSetting.automaticallySignOut.time,
            automaticallySignout: val.visitorSetting.automaticallySignOut.isSignedOut,
        };
    });
    let date = new Date()
    // let date1 = new Date(date).toLocaleString("en-US", {
    //     timeZone:"Asia/Kolkata",
    //   });

    //   let d2 = new Date().getTime() + new Date().getTimezoneOffset();
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // var finalDate = final + ", 11:59:59 p.m.";
    var finalDate =
        dayNames[date.getDay()] +
        " " +
        monthNames[date.getMonth()] +
        " " +
        date.getDate() +
        " " +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        "00" +
        " " +
        "GMT+0530 (India Standard Time)";
    userIds.forEach(async (el) => {
        if (el.automaticallySignout == true) {
            let hours = 0;
            let mins;
            let signoutTime = el.time.substring(0, el.time.length - 2).split(":");
            hours = parseInt(signoutTime[0]);
            mins = parseInt(signoutTime[1]);
            if (el.time.substring(el.time.length - 2) !== "am") {
                if (hours != 12) {
                    hours = hours + 12
                }
            }
            if (hours == date.getHours()) {
                let localVisitors = await Visitor.find({
                    userId: el.id,
                });
                localVisitors.map(async (val) => {
                    if (!val.logoutTime && !val.isPending) {
                        val.logoutTime = finalDate;
                    }
                    await val.save();
                });
            }
        }
    });

    // try {
    //     var data = await Visitor.updateMany({
    //         logoutTime: {
    //             $exists: false,
    //         },

    //     },

    //     {
    //         $set: {
    //             logoutTime: finalDate,
    //         },
    //     });
    // } catch (err) {
    //     console.log(err);
    // }
}

async function Employeelogout(req, res, next) {
    const settingsData = await Setting.find({
        "EmployeeSetting.automaticallySignOut": true
    });
    const userIds = settingsData.map((val) => {
        return {
            id: val.userId,
            time: val.EmployeeSetting.selected,
            automaticallySignout: val.EmployeeSetting.automaticallySignOut,
        };
    });

    let date = new Date();

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // var finalDate = final + ", 11:59:59 p.m.";
    var finalDate =
        dayNames[date.getDay()] +
        " " +
        monthNames[date.getMonth()] +
        " " +
        date.getDate() +
        " " +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        "00" +
        " " +
        "GMT+0530 (India Standard Time)";

    userIds.forEach(async (el) => {
        if (el.automaticallySignout === true) {
            let hours = 0;
            let mins;
            let signoutTime = el.time.substring(0, el.time.length - 2).split(":");
            hours = parseInt(signoutTime[0]);
            mins = parseInt(signoutTime[1]);
            if (el.time.substring(el.time.length - 2) !== "am") {
                hours = hours + 12;
            }

            if (hours == date.getHours()) {
                let localVisitors = await Employee.find({
                    userId: el.id,
                });
                //timeline
                localVisitors.forEach(async (ele, i) => {
                    const timeline = await Timeline.find({
                        employeeId: ele._id,
                        userId: ele.userId,
                        logoutTime: {
                            $exists: false,
                        },
                    });
                    if (timeline[0] !== undefined) {
                        await Timeline.updateOne({
                            _id: timeline[0]._id,
                        }, {
                            logoutTime: finalDate,
                        });
                    }
                });

                //employee
                localVisitors.map(async (val) => {
                    if (val.lastActivity.recent === "login") {
                        if (val.isRemote == true) {
                            val.isRemote = true;
                            val.lastActivity.recent = "logout";
                            val.lastActivity.time = finalDate;
                            val.logoutTime = finalDate;
                        } else {
                            val.isRemote = false;
                            val.lastActivity.recent = "logout";
                            val.lastActivity.time = finalDate;
                            val.logoutTime = finalDate;
                        }
                    }
                    await val.save();
                });
            }
        }
    });
}

app.get("/", (req, res) => {
    res.send("ok");
});

app.get("/error", (req, res) => {
    res.download('error.log');
});

//error handling middleware
app.use((err, req, res, next) => {
    errormessage = err.message

    logger.error({
        errormessage
    });
    res.status(500).json({
        error: true,
        message: "Internal Server Error",
        details: err.message,
    });
});

//server
app
    .listen(port, () => {
        console.log(`App is running on port ${port}`);
    })
    .on("error", function (err) {
        console.log("Sowething Went Worng");
    });