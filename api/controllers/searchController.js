const Post = require('../../models/Post')

exports.search = async function (req, res) {
    let result = await Post.findPostsByTerms(req.body.searchFor)
    res.json(result)
}