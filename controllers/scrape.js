const scrapeIt = require("scrape-it");
const BotData = require('../models/BotData');
const ScrapeJob = require('../models/ScrapeJob');
const q = require('q');
const async = require('async');



exports.index = (req, res) => {

  var scrapeJobNumber = 0;
  var change = 0;

  function Scraper (url,category,site,callback) {
    async.waterfall([

      function initializer (done) {
        console.log("1 Waterfall flowing...")
        done(null, url, category, site);
      },

      function scrapeUrl (url, category, site, done) {
        console.log("2 Scraping: " + site + ", " + category);
        scrapeIt(url, {
              bots: {
                listItem: ".app_row.interactive",
                data: {
                  title: "span.media_list_title",
                  subtitle: "span.media_list_subtitle",
                  img: {
                    selector: ".media_list_media"
                  , attr: "src"
                  },
                  url: {
                      selector: ".media_list_inner"
                    , attr: "href"
                  }
                }
              }
          }).then(page => {
            done(null, page, url, category, site);
          });
      },

      function getScraperJobNumber (page, url, category, site, done) {
        ScrapeJob
          .find()
          .sort({ _id: -1 })
          .limit(1)
          .exec((err, scrapeJobs) => {
            console.log ("Last job fetched. No.: " + scrapeJobs[0].number);
            done(null, page, url, category, site, scrapeJobs[0].number+1);
          })
      },

      function saveScrapedBots (page, url, category, site, scrapeJobNumber, done)
      {
        var botCount = 0;
        var title;
        var change = 0;

        for (var i = 0, len = page.bots.length; i <= len; i++) {
          if (i==len) {
            done(null, page, url, category, site, scrapeJobNumber, botCount);
          }
          else {
            title = page.bots[i].title;
            subtitle = page.bots[i].subtitle;
            console.log (title);
            BotData
              .find({ 'name': title, 'category': category })
              .sort({ _id: -1 })
              .limit(1)
              .exec((err, lastBotDataPoint) => {
                if (err) { console.log(err); }
                else {
                  change = 0 + lastBotDataPoint[0].rank - botCount;
                }
              })
              var botdata = new BotData({
                name: title,
                subtitle: subtitle,
                site: site,
                category: category,
                rank: ++botCount,
                change: change,
                job: scrapeJobNumber
              })
              botdata.save((err) => {
                if (err) { console.log(err); }
              });
            }
        }
      },

      function logScrapeJob (page, url, category, site, scrapeJobNumber, botCount, done)
      {
        var scrapejob = new ScrapeJob ({
          site: site,
          category: category,
          url: url,
          number: scrapeJobNumber,
          items: botCount
        })
        scrapejob.save((err) => {
          if (err) { console.log(err); }
          else {
            console.log("Job logged.")
          };
        }).then (function (){
          done(null, scrapeJobNumber);
        });
      }
    ], (err) => {
      if (err) { console.log("Found an error: " + err); }
      else { console.log ("Waterfall dried out.")}
    });

    callback();
  };

/*
    function Scraper (url,category,site,callback) {
      scrapeIt(url, {
            bots: {
              listItem: ".app_row.interactive",
              data: {
                title: "span.media_list_title",
                url: {
                    selector: ".media_list_inner"
                  , attr: "href"
                }
              }
            }
        }).then(page => {

          ScrapeJob
            .find()
            .sort({ _id: -1 })
            .limit(1)
            .exec((err, scrapeJobs) => {
              console.log ("Last job fetched. No.: " + scrapeJobs[0].number);
            }).then(scrapeJobs => {
              scrapeJobNumber += scrapeJobs[0].number + 1;
              console.log("Starting scrape job no. " + scrapeJobNumber)
              console.log("Scraping " + category + " on " + site)
              var i = 1;
              page.bots.forEach(item => {
                BotData
                  .find({ 'name': item.title, 'category': category }, 'name rank job')
                  .sort({ _id: -1 })
                  .limit(1)
                  .exec((err, lastBotDataPoint) => {
                    if (err) { console.log(err); }
                    else {
                    }
                  }).then(lastBotDataPoint => {
                      var change = 0 + lastBotDataPoint[0].rank - i;
                      var botdata = new BotData({
                        name: item.title,
                        venue: site,
                        category: category,
                        rank: i++,
                        change: change,
                        job: scrapeJobNumber
                      })
                      botdata.save((err) => {
                        if (err) { console.log(err); }
                        else {
                        };
                      });
                    });
                  }).then( function (){
                    console.log("Got to save the Scrapejob.");
                    var scrapejob = new ScrapeJob ({
                      site: site,
                      category: category,
                      url: url,
                      number: scrapeJobNumber,
                      items: i
                    })
                      scrapejob.save((err) => {
                        if (err) { console.log(err); }
                        else {
                          console.log("Job logged.")
                        };
                      }).then (function (){
                        callback();
                      });
                  });
                })
      });
    }

    */

  Scraper("https://www.slack.com/apps/category/At0MQP5BEF-bots", "Bots", "Slack App Dir", function () {
    Scraper("https://www.slack.com/apps/category/At0G5YTKU2-analytics", "Analytics", "Slack App Dir", function () {
      Scraper("https://www.slack.com/apps/category/At0EFT6869-communication", "Communication", "Slack App Dir", function () {
        Scraper("https://www.slack.com/apps/category/At0EFRCDQC-customer-support", "Customer Support", "Slack App Dir", function () {
          Scraper("https://www.slack.com/apps/category/At0EFRCDNY-developer-tools", "Developer Tools", "Slack App Dir", function () {
            Scraper("https://www.slack.com/apps/category/At0EFX4CCE-design", "Design", "Slack App Dir", function () {
              Scraper("https://www.slack.com/apps/category/At0EFRCDPW-file-management", "File Management", "Slack App Dir", function () {
                Scraper("https://www.slack.com/apps/category/At0MRS55PA-health-medical", "Health and Medical", "Slack App Dir", function () {
                  Scraper("https://www.slack.com/apps/category/At0EFT6893-hr", "HR", "Slack App Dir", function () {
                    Scraper("https://www.slack.com/apps/category/At0EFRCDQU-marketing", "Marketing", "Slack App Dir", function () {
                      Scraper("https://www.slack.com/apps/category/At0EFWTRAM-office-management", "Office Management", "Slack App Dir", function () {
                        Scraper("https://www.slack.com/apps/category/At0EFX9EF9-payments-accounting", "Payments and Accounting", "Slack App Dir", function () {
                          Scraper("https://www.slack.com/apps/category/At0EFXUU6N-productivity", "Productivity", "Slack App Dir", function () {
                            Scraper("https://www.slack.com/apps/category/At0EFY3MJ4-project-management", "Project Management", "Slack App Dir", function () {
                              Scraper("https://www.slack.com/apps/category/At0EFWTRA5-security-compliance", "Security and Compliance", "Slack App Dir", function () {
                                Scraper("https://www.slack.com/apps/category/At0EFXUU0J-social-fun", "Social and Fun", "Slack App Dir", function () {
                                  Scraper("https://www.slack.com/apps/category/At0QUNV823-travel", "Travel", "Slack App Dir", function () {
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  res.render('home', {
    title: 'Home'
  });
};
