'use strict';

const mongoose = require('mongoose'),
      News = require('../models/News'),
      Posts = require('../models/Posts'),
      services = require('../services'),
      request = require('request'),
      cheerio = require('cheerio'),
      moment = require('moment');

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

function getCurrDate() {
    return moment(new Date).format('MM/DD/YYYY');
}

function formatDate(arr) {
    arr.forEach(item => {
        item.createdAt = moment(new Date(item.createdAt)).format('MM/DD/YYYY');
    });
    return arr;
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
        News.find((err, doc) => {
            if(err) {
                res.send('Error: ' , err);
            } else {
                res.render('science-news', {
                    title: 'Science News',
                    date: getCurrDate(),
                    newsList: buildList(doc) ,
                });
            }
        });
    },

    viewArticle: (req, res) => {

        News
            .findOne({ _id: req.params.id })
            .populate('posts')
            .exec(function (err, docs) {
              if (err) {
                console.log('error: ' + err);
              } else {
                console.log('The docs are %s', docs);
                let articleDate = moment(docs.createdAt).format('MM/DD/YYYY');

                // Reformat correct date display for each post
                let posts = formatDate(docs.posts);

                res.render('article', {
                    title: 'Science News',
                    date: articleDate,
                    heading: docs.heading,
                    imgUrl: docs.imgUrl,
                    description: docs.description,
                    articleLink: docs.link,
                    newsId: docs._id,
                    posts,
                });
              }
            });

        /*
        News.findOne({ _id: req.params.id }, (err, doc) => {
            let date = moment(doc.createdAt).format('MM/DD/YYYY');
            res.render('article', {
                title: 'Science News',
                date,
                heading: doc.heading,
                imgUrl: doc.imgUrl,
                description: doc.description,
                articleLink: doc.link,
                newsId: doc._id,
            });
        });*/
    },

    postComment: (req, res) => {
        let post = req.body.post;
        let _userRef = req.session.userId;
        let _articleRef = req.body.articleRef;
        // Save resulting post _id for use in News update query
        var postId;
        console.log('post: ' + post + '_userRef: ' + _userRef + 'articleRef: ' + _articleRef);
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
                //postId = new mongoose.Schema.ObjectId(doc._id);
                console.log('doc: ' + doc + 'postId: ' + postId + 'success');

                News.findByIdAndUpdate(_articleRef,
                    { $push: { posts: postId } },
                    { new: true },  (err, model) => {
                        if (err) {
                            console.log('error: ' + err);
                        } else {
                            console.log('model: ' + model);
                        }
                });
            }
        });
        console.log('postId in find: ' , postId);
    },

    removeNews: (req, res) => {
        News.remove({}, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                res.send('All news was removed!');
            }
        })
    },
}
