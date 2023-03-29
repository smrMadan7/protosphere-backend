
module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinNotifications', (params) => {
        console.log('socket-sender',params);
      socket.join(params.address)
    //   cb()
    })

    socket.on('sendNotifications', (request) => {
        console.log(request);
      io.to(request.receiver).emit('receiveNotifications', request)
    })
  })
}