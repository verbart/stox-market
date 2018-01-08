const gulp = require('gulp');
const postcss = require('gulp-postcss');
const stylus = require('gulp-stylus');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');
const gutil = require('gulp-util');
const tinypng = require('gulp-tinypng-nokey');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const pug = require('gulp-pug');
const webpack = require('webpack');
const bro = require('gulp-bro');

const isDevelopment = process.env.NODE_ENV !== 'production';
const distPath = isDevelopment ? './public' : './dist';

gulp.task('views', function () {
  return gulp.src('./src/index.pug')
    .pipe(pug({
      basedir: './',
      data: {
        require: require
      }
    }))
    .on('error', function(error) {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      this.emit('end');
    })
    .pipe(gulp.dest(distPath));
});

gulp.task('styles', function () {
  return gulp.src('./src/app.styl')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(stylus({
      'include css': true
    })
    .on('error', function(error) {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      this.emit('end');
    }))
    .pipe(gulpIf(!isDevelopment, postcss([
      autoprefixer({
          browsers: ['> 5%', 'ff > 14']
      })
    ])))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(!isDevelopment, cleanCSS()))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(distPath + '/css'))
});

gulp.task('scripts', function () {
  return gulp.src('./src/app.js')
    .pipe(bro({
      debug: isDevelopment,
      transform: [
        babelify.configure({ presets: ['es2015'] }),
      ]
    }))
    .pipe(gulpIf(!isDevelopment, uglify()))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(distPath + '/js'));
});

gulp.task('images', function () {
  return gulp.src('./src/assets/images/**/*.*')
    .pipe(gulpIf(!isDevelopment, tinypng()))
    .pipe(gulp.dest(distPath + '/images'));
});

gulp.task('fonts', function () {
  return gulp.src([
      './src/assets/fonts/**/*.*'
  ])
    .pipe(gulp.dest(distPath + '/fonts'));
});

gulp.task('misc', function () {
  return gulp.src('./src/assets/misc/**/*.*')
    .pipe(gulp.dest(distPath));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.{pug}', gulp.series('views'));
  gulp.watch('./src/**/*.{css,styl}', gulp.series('styles'));
  gulp.watch('./src/**/*.{js}', gulp.series('scripts'));
  gulp.watch('./src/assets/images/**/*.*', gulp.series('images'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: distPath,
    port: 8080
  });

  browserSync.watch(distPath + '/**/*.*').on('change', browserSync.reload);
});

gulp.task('clean', function () {
  return del(distPath)
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'images',
    'styles',
    'scripts',
    'views',
    'fonts'
  )
));

gulp.task('default', gulp.series(
  'build',
  gulp.parallel(
    'watch',
    'serve'
  )));
