var gulp   = require('gulp');
var gutil  = require('gulp-util');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var mocha  = require('gulp-mocha');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var istanbul = require('gulp-istanbul');
var del = require('del');

var basename = 'swagger-client';
var paths = {
  sources: ['src/js/*.js'],
  tests: ['test/*.js'],
  dist: 'lib'
};

paths.all = paths.sources.concat(paths.tests).concat(['gulpfile.js']);


gulp.task('clean', function (cb) {
  del([
    paths.dist + '/**',
  ], cb);
});

gulp.task('lint', function() {
  return gulp
    .src(paths.all)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
  return gulp
    .src(paths.tests)
    .pipe(mocha());
});

gulp.task('cover', function (cb) {
  gulp.src(paths.sources)
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(paths.tests)
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('build', function() {
  return gulp.src(paths.sources)
    .pipe(concat(basename + '.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify())
    .pipe(rename(basename + '.min.js'))
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('watch', ['test'], function() {
  gulp.watch(paths.all, ['test']);
});

gulp.task('default', ['clean', 'lint', 'test', 'build']);
