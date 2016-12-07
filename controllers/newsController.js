'use strict';

const News = require('../models/News'),
      services = require('../services'),
      request = require('request'),
      cheerio = require('cheerio'),
      moment = require('moment');

function buildList(arr) {
    if(arr.length > 0) {
        let html = `<ul class="list-group">`;
        arr.forEach(obj => {
            html += `<li class="list-group-item"> ${obj.heading} </li>`;
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
                    let link = parent.children('h3').children('a').attr('href');
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
                    /*
                    services.insertNews({
                        link,
                        heading,
                        description,
                        imgUrl,
                    }).exec(() => {

                    });*/
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
