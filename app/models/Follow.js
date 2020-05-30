const followsCollection = require('../db').db().collection("follows")
const ObjectID = require('mongodb').ObjectID
class Follow {
    constructor(data) {
        this.follower = new ObjectID(data.follower)
        this.followed = new ObjectID(data.followed)
        this.createdAt = new Date()
    }
    follow() {
        return followsCollection.insertOne({ follower: this.follower, followed: this.followed, createdAt: this.createdAt })
    }
    unfollow() {
        return followsCollection.findOneAndDelete({ follower: this.follower, followed: this.followed })
    }
    static async getFollowers(user_id) {
        let followers = await followsCollection.aggregate([
            { $match: { followed: new ObjectID(user_id) } },
            { $lookup: { from: "users", as: "user", localField: "follower", foreignField: '_id' } },
            {
                $project: {
                    _id: 0,
                    user: { $arrayElemAt: ["$user", 0] }
                }
            }

        ]).toArray()
        return followers.map(follower => {
            return { 
                _id: follower.user._id,
                username: follower.user.username,
                avatar: follower.user.avatar
            }
        })
    }
    static async getFollowings(user_id) {
        let followings = await followsCollection.aggregate([
            { $match: { follower: new ObjectID(user_id) } },
            { $lookup: { from: "users", as: "user", localField: "followed", foreignField: '_id' } },
            {
                $project: {
                    _id: 0,
                    user: { $arrayElemAt: ["$user", 0] }
                }
            }

        ]).toArray()
        return followings.map(following => {
            return { 
                _id: following.user._id,
                username: following.user.username,
                avatar: following.user.avatar
            }
        })
    }
}
module.exports = Follow