let cors = require('cors');

module.exports = app =>{
    let router = require("express").Router();
    let userController = require('../controller/user');
    let postController = require('../controller/posts');
    let feedController = require('../controller/feed');
    let notificationController = require('../controller/notification');
    let followController = require('../controller/follow');

    router.post('/user/verify',userController.verify);
    router.get('/user/checkHandleAvailability/:handle',userController.checkHandle);
    router.post('/user/registerMember',userController.registerMember);
    router.post('/user/registerTeam',userController.registerTeam);
    // To remove profile from here and frontend | replace with profile
    router.get('/user/getProfile/:address',userController.getProfile);
    router.post('/user/getProfiles',userController.getProfiles);
    router.get('/user/getAllProfiles',userController.getAllProfiles);

    router.post('/post/create',postController.createPost);
    router.get('/post/getPostByWallet/:address',postController.getPostsByAddress);
    router.post('/post/like',postController.like);
    router.post('/post/share',postController.share);
    router.post('/post/comment',postController.comment);
    router.get('/post/get/:postId',postController.getPost);
    router.get('/post/comments/get/:postId',postController.getComments);
    router.post('/post/comments/edit',postController.editComment);

    router.get('/feed/getFeed/:address',feedController.getFeed);

    router.get('/notifications/:address',feedController.getNotifications);

    router.post('/profile/follow',followController.follow);
    router.post('/profile/unfollow',followController.unfollow);
    router.get('/profile/followers/:profile',followController.getFollowers);
    router.get('/profile/following/:profile',followController.getFollowingProfiles);



    app.use('/api/', router);

}