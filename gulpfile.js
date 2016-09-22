'use strict';

/**
 * Setup: run npm install to install the dependencies
 * 
 * gulp sass - compile default theme
 * gulp watch - compile & watch default theme
 * gulp sass --theme light - compile light theme, you can specify any theme, if the folder & .scss file exist
 * gulp watch --theme light - compile & watch light theme, you can specify any theme, if the folder & .scss file exist
 * gulp clean-translations - searches unused key/translation pairs in language files and removes them
 * gulp translations - gets latest translations from googleDocs excel and writes them in language files
 * gulp styleguide - generates styleguide
 * gulp serve - compile & watch styleguide.
 * gulp serve --nosass - compile & watch styleguide but skip sass watching (useful when you have separate sass watchers running)
 * gulp serve --nobrowsersync - compile & watch styleguide but don't launch server
 * gulp serve --watchtheme - compile & watch styleguide and also listen to styleguide style changes
 *
 */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    path = require('path'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    argv = require('yargs').argv,
    async = require('async'),
    fs = require('fs'),
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
    autoprefixer({AUTOPREFIXER_BROWSERS}),
    cssnano()
];

/*
    Parses all theme sass files and application.scss and generates css
    Used primeraly with "serve" task
 */
gulp.task('sass', function() {
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
    Listens to changes in all scss files and calls sass parse
 */
gulp.task('watch', ['sass'], function() {
    gulp.watch(paths.scss + '**/*.scss', ['sass']);
});

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "."
    });

    gulp.watch(paths.scss + '**/*.scss', ['sass']);
    gulp.watch("**/*.html").on('change', browserSync.reload);
});