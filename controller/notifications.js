
let constants = require('../config/constants');
const _db = require('../config/db');

let {User,Posts,Notifications} = require('../config/collection');

exports.getNotifications = async (req, res) => {
    try {
      let address = req.params.address;
  
      if (!address) {
        res.json({ status: false, message: "Invalid params!", statusCode: 400 });
      } else {
        console.log(address);
  
        let notifications = await _db.get().collection(Notifications).find({ subjectId : address }).sort({timestamp : -1}).limit(10).toArray();
        if (notifications) {
          res.json({ status: true, data: notifications});
        } else {
          res.json({ status: true, message: "No new notifications!" });
        }
  
      }
    } catch (error) {
      console.log(error);
      res.json({ status: false, message: "Something went wrong!" });
  
    }
  
  
  }