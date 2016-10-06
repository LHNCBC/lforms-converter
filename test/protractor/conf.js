exports.config = {
  directConnect: true, // Avoids occasional timeout while launching selenium web-driver.
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'firefox'
  },
  specs: 'spec/*.spec.js',
  baseUrl: 'http://0.0.0.0:9051',
  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    print: function() {}
  },

  onPrepare: function(){
    /**
     * By default, protracotor expects it to be angular application. This is used
     * to switch between angular and non angular sites.
     *
     * @param {Boolean} flag
     * @returns {Void}
     */
    global.setAngularSite = function(flag){
      browser.ignoreSynchronization = !flag;
    };

    // Replace default dot reporter with something better.
    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));

    // disable animation
    // http://stackoverflow.com/questions/26584451/how-to-disable-animations-in-protractor-for-angular-js-appliction
    var disableNgAnimate = function() {
      angular
        .module('disableNgAnimate', [])
        .run(['$animate', function($animate) {
          $animate.enabled(false);
        }]);
    };
    browser.addMockModule('disableNgAnimate', disableNgAnimate);

  }

};
