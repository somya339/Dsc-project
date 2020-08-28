const database = require('../utils/database').getdb;

class signup {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    save() {
        let db = database();
        db.collection("DSC_Test_base").insertOne(this).then((result) => {
            console.log("inserted")
        }).catch((err) => {
            console.log(err);
        });
    }
    static fetch(email, name, cb) {
        let db = database();
        db.collection("DSC_test_base").findOne({
            name: name,
            email: email
        }).then((result) => {
            // console.log(result)
            cb(result);
        }).catch((err) => {
            console.log(err);
        });
    }
    static check_cred(name, cb) {
        let db = database();
        db.collection("DSC_Test_base").findOne({
            name: name
        }).then((result) => {
            cb(result)
        }).catch((err) => {
            console.log(err);
        });
    }
};

module.exports = signup;