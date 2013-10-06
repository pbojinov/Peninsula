// Karma configuration
// Generated on Tue Jul 30 2013 13:25:12 GMT-0700 (PDT)


// base path, that will be used to resolve files and exclude
basePath = '..';


// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,

    //libraries, app dependencies
    /*
    'app/js/lib/2.0.0-crypto-sha1.js',
    'app/js/lib/2.0.0-hmac-min.js',
    'app/js/lib/jquery.min.js',
    'http://api.conduit.com/BrowserCompApi.js',
    'app/js/lib/jquery.bindWithDelay.js',
    'app/js/lib/jquery.xml2json.js',
    'app/js/lib/handlebars.js',
    /* */

    //test lib
    //'test/spec/javascripts/support/jasmine-jquery.js',

    //app source
    'peninsula.js',

    //app tests
    'test/unit/peninsula.test.js'

    //fixtures
    /*
    {
        pattern: 'test/spec/javascripts/fixtures*//*.html',
        included: false,
        served: true
    }
    */
];

proxies = {
    '/' : 'http://localhost:3502/'
};

//Code coverage
preprocessors = {
    'peninsula.js': 'coverage'
};

// list of files to exclude
exclude = [

];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress', 'coverage'];

//Coverage report
coverageReporter = {
    type : 'html',
    dir : 'coverage/'
}


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Firefox'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
