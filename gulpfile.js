'use strict';

/**
 * Setup: run npm install to install the dependencies
 * 
 * gulp scss - compile scss
 * gulp watch-scss - compile & watch default scss
 * gulp serve - start browserSyn server and compile & watch your project
 *
 */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    browserSync = require('browser-sync').create()

var paths = {
    scss: 'styles/scss/',
	css: 'styles/css/',
    images: 'images/',
    scripts: 'scripts/'
};

var onError = function(err) {
    gutil.log('There was an issue\n'.bold.red + gutil.colors.green(err));
    this.emit('end');
};
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];
var processors = [
    autoprefixer(AUTOPREFIXER_BROWSERS),
    cssnano()
];


gulp.task('scss', function() {
    return gulp.src([paths.scss + "**/*.scss"])
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(rename(function(path) {
            path.dirname = '';
            path.extname = '.css';
        }))
        .pipe(gulp.dest(function(file) {
            return paths.css;
        }))
        .pipe(browserSync.stream());
});

/*
    Listens to changes in all scss files and calls scss parse
 */
gulp.task('watch-scss', ['scss'], function() {
    gulp.watch(paths.scss + '**/*.scss', ['scss']);
});

gulp.task('serve', ['watch-scss'], function() {

    browserSync.init({
        server: "."
    });

    gulp.watch("**/*.html").on('change', browserSync.reload);
});