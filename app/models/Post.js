const postsCollection = require('../db').db().collection("posts")
const ObjectID = require('mongodb').ObjectID

class Post {
    constructor(data) {
        this._id = new ObjectID(data._id)
        this.title = data.title
        this.body = data.body
        this.author_id = data.author_id
    }
    validateData() {
        let dataErrors = []
        if (this.title.length < 12) {
            dataErrors.push('title must be more than 12 character')
        }
        if (this.body.length < 12) {
            dataErrors.push('body must be more than 12 character')
        }
        return dataErrors
    }

    save() {
        return new Promise(async (resolve, reject) => {
            let dataErrors = this.validateData()
            if (dataErrors.length) {
                reject(dataErrors)
            } else {
                let data = {
                    title: this.title,
                    body: this.body,
                    createdAt: new Date(),
                    author_id: new ObjectID(this.author_id)
                }
                await postsCollection.insertOne(data).then(result => {
                    resolve(result.ops[0])
                }).catch(errors => {
                    console.log(errors)
                    resolve(['database error'])
                })
            }
        })
    }

    update() {
        return new Promise(async (resolve, reject) => {
            let errors = await this.validateData()
            if (errors.length) {
                reject(errors)
            } else {
                let newData = {
                    title: this.title,
                    body: this.body,
                    updatedAt: new Date()
                }
                let result = await postsCollection.findOneAndUpdate({ _id: new ObjectID(this._id) }, { $set: newData })
                resolve(result.value)
            }
        })
    }

    static deletePost(post_id) {
        return new Promise(async (resolve, reject) => {
            if (ObjectID.isValid(post_id)) {
                await postsCollection.findOneAndDelete({ _id: new ObjectID(post_id) })
                resolve()
            } else {
                reject()
            }
        })
    }

    static async findSinglePost(post_id) {
        if(ObjectID.isValid(post_id)){
            return await this.findPosts({ _id: new ObjectID(post_id) })
        }
            return []
    }

    static async findPostsByAuthors(authors) {
        authors = authors.map(author => {
            return new ObjectID(author._id)
        })
        return await this.findPosts({ author_id: { $in: authors } })
    }

    static async findPostsByTerms(searchTerm) {
        if (typeof searchTerm == 'string') {
            return await this.findPosts({ $or: [{ title: { $regex: searchTerm } }, { body: { $regex: searchTerm } }] })
        }
        return []
    }

    static async findPosts(filter) {
        let posts = await postsCollection.aggregate([
            { $match: filter },
            { $lookup: { from: "users", as: "author", localField: "author_id", foreignField: "_id" } },
            { $sort: {createdAt: -1}},
            {
                $project: {
                    title: 1,
                    body: 1,
                    createdAt: 1,
                    author: { $arrayElemAt: ["$author", 0] }
                }
            }
        ]).toArray()
        posts = posts.map(post => {
            post.author = {
                username: post.author.username,
                avatar: post.author.avatar
            }
            return post
        })
        return posts
    }
}
module.exports = Post