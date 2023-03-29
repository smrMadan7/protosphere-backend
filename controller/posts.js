let constants = require('../config/constants');
const Web3 = require('web3');
const axios = require('axios');
const _db = require('../config/db');
const provider = new Web3.providers.HttpProvider(
    constants.HyperspaceRPC
);
let {User,Posts} = require('../config/collection');

const { create } = require('ipfs-http-client')
const ipfs = create(constants.ipfsURL) 


exports.createPost = async (req, res) => {
    try {
      let { postId, address, postData } = req.body;
      if (!postId || !address || !postData) {
        res.statusCode = 400;
        res.json({ staus: false, message: "Invalid params" });
      } else {
        // add txn and add post id
        let cid = await ipfs.add(Buffer.from(JSON.stringify(postData)));
        console.log(req.body, cid.path);
        await _db.get().collection(Posts).insertOne({
          postId,
          createdBy: address,
          postURI: cid.path,
          timestamp: new Date().getTime(),
          likes:[],
          shares: [],
          tags,

        });
        res.json({ staus: true, data:{postId:postId}});
      }
    } catch (error) {
      console.log(error);
    }   

}



exports.getPostsByAddress = async (req, res) => {
    try {
        let { address} = req.params;
    if(!address ){
        res.statusCode = 400;
        res.json({staus:false, message: 'Invalid params'});
    }else{
        let posts =  await _db.get().collection(Posts).find({    
            $or:[{createdBy:address},{shares: {$in:[address]}}]       
        }).sort({timestamp:-1}).toArray();
        res.json({staus:true, data: posts});
    }
    
    } catch (error) {
        console.log(error);
    }   

}


// // simple like
// exports.like = async (req, res) => {
//     try {
//         let {postId,handle} = req.body;
        
//         console.log(postId);
//         if(!postId){
//             res.json({status: false, message: 'Invalid params!'});       

//         }else{
//             await _db.get().collection(Posts).updateOne( { postId: postId },{ $inc: { likes: 1 }});
//             res.json({status: true, message: ''});
//         }
        
//     } catch (error) {
//         res.json({status: false, message: 'unable to update like'});        
//     }
// }



exports.like = async (req, res) => {
    try {
        let {postId, address,action} = req.body;
        
        if(!postId || !address && !action){
            res.json({status: false, message: 'Invalid params!'});       

        }else{
            if(action == 'like'){
                console.log('like');
                await _db.get().collection(Posts).updateOne( { postId: postId },{"$addToSet": {likes:address}});
                res.json({status:true,data:null});
            }else if (action == 'unlike'){
                await _db.get().collection(Posts).updateOne( { postId: postId },{$pull: {likes:address}});
                res.json({status:true,data:null});

            }else{
                res.json({status:false,message:'Invalid action'});
            }
        }
        
    } catch (error) {
        res.json({status: false, message: 'unable to update like'});        
    }
}




exports.share = async (req, res) => {
    try {
        let {postId, sharedBy} = req.body;
        
        if(!postId || !sharedBy){
            res.json({status: false, message: 'Invalid params!'});       

        }else{           
            await _db.get().collection(Posts).updateOne( { postId: postId },{"$addToSet": {shares : sharedBy} });
            res.json({status:true,data:null});
        }
        
    } catch (error) {
        res.json({status: false, message: 'unable to update like'});        
    }
}



exports.comment = async (req,res) => {
    try {
        let {postId,commentId,commenter,comment,tags} = req.body;
        if(!postId || !commentId || !commenter || !comment){
            res.json({status: false, message: 'Invalid params!'});      
        }else{
            let ts = new Date().getTime()
            await _db
              .get()
              .collection(Posts)
              .updateOne(
                { postId: postId },
                {
                  $push: {
                    comments: {
                        comment,
                        commentId,
                        commenter,
                        tags,
                        timestamp:ts
                    },
                  },
                },
                { upsert: true }
              );

            res.json({status: true, data:{id:commentId}});
        }
    } catch (error) {
        console.log(error);
        res.json({status: false, message: 'Something went wrong!'});
    }
}



exports.editComment = async (req,res) => {
    try {
        let {postId,commentId,commenter,comment,tags,timestamp} = req.body;
        if(!postId || !commentId || !commenter || !comment || !timestamp){
            res.json({status: false, message: 'Invalid params!'});      
        }else{
            await _db
              .get()
              .collection(Posts)
              .updateOne(
                { 'comments.commentId': commentId },
                {
                  $set: {
                    'comments.$' : req.body
                  },
                },
                { upsert: true }
              );

            res.json({status: true, data:{id:commentId}});
        }
    } catch (error) {
        console.log(error);
        res.json({status: false, message: 'Something went wrong!'});
    }
}




exports.getPost = async (req,res) => {
    try {
        let {postId} = req.params;
        if(!postId){
            res.json({status: false, message: 'Invalid params!'});      
        }else{
            let data = await _db.get().collection(Posts).findOne( { postId: postId });  
            res.json({status: true, data: {postId,data}});           
        }
    } catch (error) {
        console.log(error);
        res.json({status: false, message: 'Something went wrong!'});
    }
} 



exports.getComments = async (req,res) => {
    try {
        let {postId} = req.params;
        if(!postId){
            res.json({status: false, message: 'Invalid params!'});      
        }else{
            // let data = await _db.get().collection(Posts).findOne( { postId: postId },{_id:0,comments:1});  
            let data = await _db.get().collection(Posts).findOne( { postId: postId });  
            if(data){
                if(data.comments){
                    for(comment of data.comments){
                        let user = await _db.get().collection(User).findOne( { address: comment.commenter },{_id:0,profilePictureUrl:1})
                        console.log(user);
                        comment['commenterProfilePic'] = user.profilePictureUrl;
                        comment['commenterDisplayName'] = user["displayName"] ? user.displayName : user.organizationName;
                        comment['commenterHandle'] = user.handle;
                    }
                    res.json({status: true, data: {postId,comments:data.comments}});

                    // let address = [];
                    // console.log(address);
                    // await data.comments.map((a) => {
                    //   address.push(a.commenter);
                    // });
                    // if(address){
                    //     let users = await _db.get().collection(User).find( { address: {$in:address} },{_id:0,profilePictureUrl:1}).toArray();
                    //     console.log(users);

                    //     data.comments.map((comment,i)=>{
                    //         comment['commenterProfile'] = users[i].profilePictureUrl
                    //     })

                    //     res.json({status: true, data: data.comments});
                    // }
                    


                }else{
                    res.json({status: true, data: []});
                }
            }else{
                res.json({status: false, message:"Invalid post id/post not found!"});
            }
        }
    } catch (error) {
        console.log(error);
        res.json({status: false, message: 'Something went wrong!'});
    }
}

