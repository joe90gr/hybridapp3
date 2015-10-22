var gulp = require('gulp');
var browserify = require('browserify');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var Server = require('karma').Server;

var DEVELOPMENT = './development';
var PUBLIC = DEVELOPMENT + '/public';
var STYLESHEETS = PUBLIC + '/stylesheets';
var JAVASCRIPTS = PUBLIC + '/javascripts';
var RESOURCES = PUBLIC + '/resources';

var COPY_FOLDERS = [
    JAVASCRIPTS + '/main.js',
    STYLESHEETS + '/style.css',
    RESOURCES + '/images',
    DEVELOPMENT + '/bin/**/*',
    DEVELOPMENT + '/routes/**/*',
    DEVELOPMENT + '/views/**/*',
    DEVELOPMENT + '/app.js'
];

gulp.task('sass', function() {
    gulp.src(STYLESHEETS + '/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(STYLESHEETS));
});

gulp.task('sass:watch', function () {
    gulp.watch(STYLESHEETS + '/sass/**/*.scss', ['sass']);
});

gulp.task('lint', function() {
    return gulp.src(JAVASCRIPTS + '/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('karma', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('browserify',['karma'],  function() {
    return browserify(JAVASCRIPTS + '/app/app.js')
        .transform(babelify)
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(JAVASCRIPTS))
});

gulp.task('uglify', ['browserify'], function() {
    return gulp.src(JAVASCRIPTS + '/main.js')
        .pipe(uglify())
        .pipe(gulp.dest(JAVASCRIPTS));
});

gulp.task('copy', ['uglify'], function() {
    gulp.src(COPY_FOLDERS, {base: 'development'})
        .pipe(gulp.dest('production'));
});

gulp.task('default', ['karma','sass', 'browserify', 'uglify', 'copy']);
