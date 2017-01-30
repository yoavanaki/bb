const BotData = require('../models/BotData');
const User = require('../models/User');
const ScrapeJob = require('../models/ScrapeJob');


function getRankedCategory (category, callback) {
  var rankedBotList = [];
  ScrapeJob
    .find({ category : category })
    .sort({ number: -1 })
    .limit(1)
    .exec((err, job) => {
      console.log ("Last job fetched.");
      console.log (job);
    }).then(scrapeJobs => {
      BotData
      .find({ 'job': scrapeJobs[0].number, 'category': category }, 'name rank change subtitle')
      .sort({ rank: 1 })
      .exec((err, botdata) => {
        var i = 0;
        botdata.forEach(item => {
          var bot = [item.rank, item.name, item.subtitle,, item.change];
          rankedBotList[i] = bot;
          i++;
        })
        callback(rankedBotList);
      })
  });
};

exports.bots = (req, res) => {
  getRankedCategory("Bots", rankedBotList => {
    console.log(rankedBotList[1]);
    res.render('charts', {
          title: 'Bots',
          bots: rankedBotList
        });
  });
 };

exports.analytics = (req, res) => {
 getRankedCategory("Analytics", rankedBotList => {
   res.render('charts', {
         title: 'Analytics',
         bots: rankedBotList
       });
 });
};

exports.communication = (req, res) => {
  getRankedCategory("Communication", rankedBotList => {
    res.render('charts', {
          title: 'Communication',
          bots: rankedBotList
        });
  });
 };

exports.support = (req, res) => {
 getRankedCategory("Customer Support", rankedBotList => {
   res.render('charts', {
         title: 'Customer Support',
         bots: rankedBotList
       });
 });
};

exports.design = (req, res) => {
 getRankedCategory("Design", rankedBotList => {
   res.render('charts', {
         title: 'Design',
         bots: rankedBotList
       });
 });
};

exports.devtools = (req, res) => {
  getRankedCategory("Developer Tools", rankedBotList => {
    res.render('charts', {
          title: 'Developer Tools',
          bots: rankedBotList
        });
  });
 };

exports.filemanagement = (req, res) => {
 getRankedCategory("File Management", rankedBotList => {
   res.render('charts', {
         title: 'File Management',
         bots: rankedBotList
       });
 });
};

exports.health = (req, res) => {
  getRankedCategory("Health and Medical", rankedBotList => {
    res.render('charts', {
          title: 'Health and Medical',
          bots: rankedBotList
        });
  });
 };

exports.hr = (req, res) => {
 getRankedCategory("HR", rankedBotList => {
   res.render('charts', {
         title: 'HR',
         bots: rankedBotList
       });
 });
};

exports.marketing = (req, res) => {
  getRankedCategory("Marketing", rankedBotList => {
    res.render('charts', {
          title: 'Marketing',
          bots: rankedBotList
        });
  });
 };

exports.office = (req, res) => {
 getRankedCategory("Office Management", rankedBotList => {
   res.render('charts', {
         title: 'Office Management',
         bots: rankedBotList
       });
 });
};

exports.accounting = (req, res) => {
  getRankedCategory("Payments and Accounting", rankedBotList => {
    res.render('charts', {
          title: 'Payments and Accounting',
          bots: rankedBotList
        });
  });
 };

exports.productivity = (req, res) => {
 getRankedCategory("Productivity", rankedBotList => {
   res.render('charts', {
         title: 'Productivity',
         bots: rankedBotList
       });
 });
};
exports.project = (req, res) => {
 getRankedCategory("Project Management", rankedBotList => {
   res.render('charts', {
         title: 'Project Management',
         bots: rankedBotList
       });
 });
};
exports.security = (req, res) => {
 getRankedCategory("Security and Compliance", rankedBotList => {
   res.render('charts', {
         title: 'Security and Compliance',
         bots: rankedBotList
       });
 });
};
exports.social = (req, res) => {
 getRankedCategory("Social and Fun", rankedBotList => {
   res.render('charts', {
         title: 'Social and Fun',
         bots: rankedBotList
       });
 });
};
exports.travel = (req, res) => {
 getRankedCategory("Travel", rankedBotList => {
   res.render('charts', {
         title: 'Travel',
         bots: rankedBotList
       });
 });
};



exports.index = (req, res) => {
  BotData.find({ 'job': 0 }, 'name rank', (err, botdata) => {
      var rankedBotList = [];
      var i = 0;
      botdata.forEach(item => {
        rankedBotList[i] = item.name;
        i++;
      });
      res.render('charts', {
        title: 'Charts',
        bots: botdata
      });
    });
};
