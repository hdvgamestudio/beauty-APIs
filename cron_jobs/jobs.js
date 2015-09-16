var resizeImage = require('./resizeImage');
var CronJob = require('cron').CronJob;

var job = new CronJob({
  cronTime: '00 59 23 * * *',
  onTick: function() {
    /*
     * Runs every day
     * at 23:59:00 PM.
     */
    console.log("running the resizing image job");
    resizeImage();
  },
  start: true,
  timeZone: 'Asia/Jakarta'
});
console.log('running cron jobs')
