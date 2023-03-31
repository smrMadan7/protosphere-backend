const _db = require('../config/db');
let { User, Notifications } = require('../config/collection');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinNotifications', (params) => {
      socket.join(params.address)
    //   cb()
    })

    socket.on('sendNotifications', async(request) => {
        console.log(request);
        request['timestamp'] = new Date().getTime();
        await _db.get().collection(Notifications).insertOne({ 
            timestamp: new Date().getTime(), 
            type: request.type ,
            performedBy: request.performedBy,
            subjectId: request.subjectId,
            details: request.details,
            state: 0            
        });
   
      io.to(request.subjectId).emit('receiveNotifications', request)
    })
  })
}



exports.getNotifications = async (req, res) => {
    try {
      let address = req.params.address;

      if (!address) {
        res.json({ status: false, message: "Invalid params!", statusCode: 400 });
      } else {
        console.log(address);

        let notifications = await _db.get().collection(Notifications).find({ subjectId : address }).sort({timestamp : -1});
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
