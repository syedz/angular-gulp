var gulp        = require('gulp'),
    del         = require('del'),
    runSequence = require('run-sequence'),
    inject      = require('gulp-inject'),
    serve       = require('gulp-serve'),
    jshint      = require('gulp-jshint');

var files = require('./gulp/gulp.config.js');

gulp.task('default', function(callback) {
  runSequence('build', 'watch', 'serve', callback);
});

gulp.task('build', function(callback) {
  runSequence('clean',
    'copy-build',
    'index',
    callback);
});

gulp.task('serve', serve('build'));

gulp.task('index', function() {
  return gulp.src('./src/index.html')
    .pipe(inject(gulp.src(files.app_files.tpl_src), { ignorePath: 'build' }))
    .pipe(gulp.dest(files.build_dir));
});

gulp.task('clean', function(callback) {
  return del([files.build_dir], { force: true }, callback);
});

gulp.task('copy-build', ['copy-assets', 'copy-app-js', 'copy-vendor-js']);

gulp.task('copy-assets', function() {
  return gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('copy-app-js', function() {
  return gulp.src('./src/**/*.js')
    .pipe(gulp.dest(files.build_dir));
});

gulp.task('copy-vendor-js', function() {
  return gulp.src('./vendor/**/*.js')
    .pipe(gulp.dest('./build/vendor'));
});

gulp.task('lint', function() {
  return gulp.src(files.app_files.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch(files.app_files.js, ['lint', 'build']);
});
