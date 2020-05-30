const usersCollection = require('../db').db().collection("users")
const bcryptjs = require('bcryptjs')
const validator = require('validator')
const ObjectID = require('mongodb').ObjectID
const Follow = require('../models/Follow')
const Post = require('../models/Post')
class User {
    constructor(data) {
        this._id = new ObjectID(data._id)
        this.username = typeof data.username == 'string' ? data.username.trim() : '';
        this.email = typeof data.email == 'string' ? data.email.trim() : '';
        this.password = typeof data.password == 'string' ? data.password : '';
        this.confirmation = typeof data.confirmation == 'string' ? data.confirmation : '';
        this.getAvatar()
    }

    async validateData() {
        let regErrors = []
        if (this.username == '') {
            regErrors.username = 'invalid username !!'
        } else {
            let usernameExist = await usersCollection.findOne({ username: this.username })
            if (usernameExist && !usernameExist._id.equals(this._id)) regErrors.push('username already taken !!')
        }
        if (!validator.isEmail(this.email)) {
            regErrors.push('invalid email !!')
        } else {
            let emailExist = await usersCollection.findOne({ email: this.email })
            if (emailExist && !emailExist._id.equals(this._id)) regErrors.push('email already taken !!')
        }
        if (this.password != this.confirmation) regErrors.push('password confirmation required !!')
        if (!this._id && this.password == '') regErrors.push('password must not be empty !!')

        return regErrors
    }

    register() {
        return new Promise(async (resolve, reject) => {
            let regErrors = await this.validateData()
            if (regErrors.length) {
                reject(regErrors)
            } else {
                usersCollection.insertOne({
                    username: this.username,
                    email: this.email,
                    password: bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(parseInt(process.env.SALT))),
                    avatar: this.avatar
                }).then(user => {
                    resolve(user.ops[0])
                }).catch(error => {
                    console.log(error)
                    reject({ database: 'database error' })
                })
            }
        })
    }

    login() {
        return new Promise(async (resolve, reject) => {
            usersCollection.findOne({ username: this.username })
                .then(foundUser => {
                    if (foundUser && bcryptjs.compareSync(this.password, foundUser.password)) {
                        resolve(foundUser)
                    } else {
                        reject(['username or password invalid !!!'])
                    }
                }).catch(error => {
                    console.log(error)
                    reject({ database: 'database error' })
                })
        })
    }

    update() {
        return new Promise(async (resolve, reject) => {
            let errors = await this.validateData()
            if (errors.length) {
                reject(errors)
            } else {
                let newData = {
                    username: this.username,
                    email: this.email,
                }
                if (this.password != '') {
                    newData.password = bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(parseInt(process.env.SALT)))
                }
                let result = await usersCollection.findOneAndUpdate({ _id: new ObjectID(this._id)}, {$set: newData} )
                resolve(result.value._id)
            }
        })
    }

    getAvatar() {
        this.avatar = this.username != '' ? `https://picsum.photos/seed/${this.username}/128/128` : '';
    }

    async getPosts() {
        this.posts = await Post.findPostsByAuthors([this])
    }

    async getFollowers() {
        this.followers = await Follow.getFollowers(this._id)
    }

    async getFollowings() {
        this.followings = await Follow.getFollowings(this._id)
    }

    async getLastfeed(){
        this.lastFeed = await Post.findPostsByAuthors(this.followings)
        
    }

    static async findUser(data) {
        let user = await usersCollection.findOne(data)
        if (user) {
            user = new User(user)
            user.getAvatar();
            await user.getPosts();
            await user.getFollowers();
            await user.getFollowings();
            await user.getLastfeed();
            return user
        }
        return
    }
}
module.exports = User