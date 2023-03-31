let constants = require('../config/constants');
const _db = require('../config/db');

let {User,Posts,Notifications} = require('../config/collection');

exports.getFeed = async (req, res) => {
    try {
      let { address } = req.params;
      if (!address) {
        res.statusCode = 400;
        res.json({ staus: false, message: "Invalid params" });
      }else{
        console.log(Posts);
        let feed = await _db.get().collection(Posts).find({
            // createdBy: {$not :{$eq:address}},
          }).sort({timestamp:-1}).toArray();

          for(f of feed){
            let profile =  await _db.get().collection(User).findOne({address:f.createdBy},{ _id: 0, profilePictureUrl: 1 });
            // console.log(profileUrl);
            f['profilePictureUrl'] = profile.profilePictureUrl;
            f['handle'] = profile.handle;
            if(profile.type == 'member'){
              f['displayName'] = profile.displayName
            }else{
              f['displayName'] = profile.organizationName;
            }
          }
    
          res.json({ staus: true, data: feed });
      }     

    } catch (error) {
      console.log(error);
    }   
}



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