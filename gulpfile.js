const gulp = require('gulp');
const gulpHb = require('gulp-hb');
const gulpData = require('gulp-data');
const gulpExt = require('gulp-ext-replace');
const gulpSass = require('gulp-sass');

gulpSass.compiler = require('node-sass');
const gulp_copy_stream = (s, d) => gulp.src(s).pipe(gulp.dest(d))

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
    .pipe(gulpSass().on('error', console.log))
    .pipe(gulp.dest('dist/css'));
})

gulp.task('copy', function () {
  return Promise.all([
    gulp_copy_stream('src/css/**/*.css', 'dist/css'),
    gulp_copy_stream('src/fonts/**/*', 'dist/fonts'),
    gulp_copy_stream('src/images/**/*', 'dist/images'),
    gulp_copy_stream('src/js/**/*.js', 'dist/js')
  ])
})

gulp.task('html', function () {
  return gulp.src('src/pages/*.hbs')
    .pipe(gulpData(file => {
      try {
        return require(file.path.replace('.hbs', '.json'))
      } catch (err) {
        return {}
      }
    }))
    .pipe(gulpHb({
      partials: 'src/partials/*.hbs',
      // helpers: config.helpersSrc + '/**/*.js',
      data: ['src/pages/*.json']
    }))
    .pipe(gulpExt('.html'))
    .pipe(gulp.dest('dist'));
});
