'use strict';

const mongoose = require('mongoose'),
      News = require('../models/News'),
      Posts = require('../models/Posts'),
      services = require('../services'),
      request = require('request'),
      cheerio = require('cheerio'),
      moment = require('moment');

// Build the news list
function buildList(arr) {
    if(arr.length > 0) {
        let html = `<ul class="list-group">`;
        arr.forEach(obj => {
            html += `<li class="list-group-item">
                        <span class="badge"> <a href="/news/view/${obj._id}">View</a> </span>
                        ${obj.heading}
                     </li>`;
        });
        html += `</ul>`;
        return html;
    } else {
        // Return false so that hbs will render 'No News Available' message
        return false;
    }
}

// Get the current date in the correct format
function getCurrDate() {
    return moment(new Date).format('MM/DD/YYYY');
}

// Reformat the array with the correct date using moment (could not get the correct way to work)
function formatDate(arr) {
    let newArr = [];
    arr.forEach((item, index) => {
        let date = moment(new Date(item.createdAt)).format('MM/DD/YYYY');
        newArr.push({
            _id: item._id,
            post: item.post,
            _userRef: item._userRef,
            _articleRef: item._articleRef,
            createdAt: date,
        });
        //console.log('item.createdAt: ' + item.createdAt);
        //console.log('date: ' + moment(new Date(item.createdAt)).format('MM/DD/YYYY'));
        //item.createdAt = moment(new Date(item.createdAt)).format('MM/DD/YYYY');
    });
    //console.log(arr);
    //return arr;
    return newArr;
}

// Build the html structure for each comment
function buildCommentBlock(commentArr) {

    let html =``;
    commentArr.forEach(item => {
      html += `
        <div id="comment">
            <blockquote>
                <small>Posted ${item.createdAt} by <cite title="Source Title"> ${item._userRef} </cite></small>
                <p>${item.post}</p>
                <a href="#" id="test-id" data-id="${item._id}">Remove Post</a>
            </blockquote>
            <legend></legend>
        </div>`;
    });
    return html;
}

module.exports = {
    insertNews: (req, res) => {
        console.log("Grabbing news...");

        // Initialize array to save data
        let data = [];

        request('http://www.foxnews.com/science.html', (err, response, html) => {
            if (err) {
                res.send('Error: ' , err);
            } else {
                // Load the body into cheerio
                let $ = cheerio.load(html);

                // Get each heading
                $('.article-ct').each((index, item) => {
                    let parent = $(item).children();
                    let imgUrl = parent.children('.m').children('a').children('img').attr('src');
                    let link = 'http://www.foxnews.com/' + parent.children('h3').children('a').attr('href');
                    let heading = parent.children('h3').children('a').text();
                    let description = $(item).children().children('p').text();

                    console.log('text: ' + heading);
                    data.push({
                        link,
                        heading,
                        description,
                        imgUrl,
                    });
                    let record = new News({
                        heading,
                        link,
                        description,
                        imgUrl,
                    });

                    record.save((err, doc) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(doc);
                        }
                    });
                });
                console.log(data);
                res.send('News was added!');
            }
        });
    },

    viewNews: (req, res) => {
        let userId = req.session.userId;
        News.find((err, doc) => {
            if(err) {
                res.send('Error: ' , err);
            } else {
                console.log('userName: ' + userId);
                res.locals = {
                    //userName: req.session.userName
                }
                res.render('science-news', {
                    title: 'Science News',
                    date: getCurrDate(),
                    newsList: buildList(doc) ,
                });
            }
        });
    },

    viewArticle: (req, res) => {
        console.log('userName: ' + req.session.userName);
        News.findOne({ _id: req.params.id })
        .populate('posts')
        .exec(function (err, docs) {
                if (err) {
                console.log('error: ' + err);
            } else {
                console.log('The docs are %s', docs);
                let articleDate = moment(docs.createdAt).format('MM/DD/YYYY');

                // If posts exist, reformat correct date display for each post and build each <blockquote>
                let commentBlocks;
                if (docs.posts.length > 0) {
                    let commentArr = formatDate(docs.posts);
                    commentBlocks = buildCommentBlock(commentArr);
                } else {
                    commentBlocks = false;
                }

                res.render('article', {
                    title: 'Science News',
                    date: articleDate,
                    heading: docs.heading,
                    imgUrl: docs.imgUrl,
                    description: docs.description,
                    articleLink: docs.link,
                    newsId: docs._id,
                    commentBlocks
                });
              }
        });
    },

    postComment: (req, res) => {
        let post = req.body.post;
        let _userRef = req.session.userId;
        let _articleRef = req.body.articleRef;
        console.log('server-side: post=' + post + '_userRef=' + _userRef + '_articleRef=' + _articleRef);
        // Save resulting post _id for use in News update query
        var postId;
        //console.log('post: ' + post + '_userRef: ' + _userRef + 'articleRef: ' + _articleRef);
        let record = new Posts({
            post,
            _userRef,
            _articleRef,
        });
        record.save((err, doc) => {
            if (err) {
                console.log('error: ' + err);
            } else {
                postId = mongoose.Types.ObjectId(doc._id);
                console.log('doc: ' + doc + 'postId: ' + postId + 'success');

                News.findByIdAndUpdate(_articleRef,
                    { $push: { posts: postId } },
                    { new: true },  (err, model) => {
                        if (err) {
                            res.send('error');
                        } else {
                            console.log('doc: ' + doc);
                            // Build blockquote and return to ajax call
                            let html = buildCommentBlock([
                                {
                                    post,
                                    _id: postId,
                                    _userRef,
                                    createdAt: getCurrDate(),
                                }
                            ]);
                            console.log('html: ' + html);
                            res.send(html);
                        }
                });
            }
        });
    },

    removeComment: (req, res) => {
        let _id = req.body.postId;
        Posts.remove({ _id }, (err, doc) => {
            if (err) {
                res.send('error');
            } else {
                res.send('success');
            }
        });
    },

    removeNews: (req, res) => {
        News.remove({}, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                return res.send('All news was removed!');
            }
        })
    },
}
