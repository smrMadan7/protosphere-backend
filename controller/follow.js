let constants = require('../config/constants');
const _db = require('../config/db');

let { User,Follow} = require('../config/collection');

exports.follow = async (req, res) => {
    try {
        let { profileId, followerId } = req.body;
        if(!profileId || ! followerId){
            res.json({status:false, message : "Invalid params!"});
        }else{
            let followed = await _db.get().collection(Follow).findOne({profileId,followerId});
            if(followed){
                res.json({status: false, message: 'Already a follower!'});
            }else{
                await _db.get().collection(Follow).insertOne({profileId,followerId});
                res.json({status: true, data: {followerId}});
            }
        }
    } catch (error) {
        console.log(error);
        res.json({status: false, message: 'Something went wrong!'});

    }
}


exports.unfollow = async (req, res) => {
    try {
        let { profileId, followerId } = req.body;
        if(!profileId || ! followerId){
            res.json({status:false, message : "Invalid params!"});
        }else{
            let followed = await _db.get().collection(Follow).findOne({profileId,followerId});
            if(followed){
                await _db.get().collection(Follow).deleteOne({profileId,followerId});
                res.json({status: true, data: {followerId} });
            }else{
                res.json({status: false, message:"Not a follower of the profile!"});                
            }
        }
    } catch (error) {
        console.log(error);
        res.json({status: false, message: 'Something went wrong!'});

    }
}


exports.getFollowers = async (req, res) => {
    try {
        let { profile } = req.params;
        if(!profile){
            res.json({status:false, message : "Invalid params!"});
        }else{
            let following = await _db.get().collection(Follow).distinct("followerId",{profileId:profile});
            console.log(following);

            let profile = await _db.get().collection(User).find({ address: { $in: following } }).toArray();
            res.json({status: true, data : {profile,count : profile.length}});            
        }
    } catch (error) {
        console.log(error);
        res.json({status: false, message: 'Something went wrong!'});

    }
}


exports.getFollowingProfiles = async (req, res) => {
    try {
        let { profile } = req.params;
        if(!profile){
            res.json({status:false, message : "Invalid params!"});
        }else{
            let followers = await _db.get().collection(Follow).distinct("followerId",{followerId:profile});
            console.log(followers);
            let profile = await _db.get().collection(User).find({ address: { $in: followers }}).toArray();
    
            res.json({status: true, data : {profile,count : profile.length}});            
        }
    } catch (error) {
        console.log(error);
        res.json({status: false, message: 'Something went wrong!'});
    
    }
}



exports.suggestions = async (req, res) => {
    try {
        let { address } = req.params;
        if(!followerId){
            res.json({status:false, message : "Invalid params!"});
        }else{
            let suggestions = await _db.get().collection(Follow).distinct("profileId",{followerId});
            res.json({status: true, data : {followers,count : followers.length}});            
        }
    } catch (error) {
        console.log(error);
        res.json({status: false, message: 'Something went wrong!'});

    }
}

