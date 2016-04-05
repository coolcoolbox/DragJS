var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;



var dirs = {
    src:'src',
    dist:'dist',
    build:'build'
};
var srcOptions = {
    srcScss:[dirs.src + '/*.scss',dirs.src + '/**/*.scss'],
    srcJS:[dirs.src + '/*.js',dirs.src + '/**/*.js'],
    srcHtml:[dirs.src + '/*.html',dirs.src + '/**/*.html']
}

gulp.task('watch', ['inject'],function () {
    gulp.watch(srcOptions.srcHtml).on('change', function () {
        gulp.start('inject');
        reload();
    });
    gulp.watch(srcOptions.srcScss, ['scss']);
});

gulp.task('scss', function () {
    return gulp.src(srcOptions.srcScss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dirs.dist))
        .pipe(reload({stream:true}));
})
gulp.task('script', function () {
    return gulp.src(srcOptions.srcJS)
        .pipe(gulp.dest(dirs.dist))
})
var distOpstions = {
    srcJS:[dirs.dist + '/*.js',dirs.dist + '/**/*.js'],
    srcCss:[dirs.dist + '/*.css',dirs.dist + '/**/*.css']
}
var injectStyles = gulp.src(distOpstions.srcCss),
    injectScript = gulp.src(distOpstions.srcJS);
gulp.task('inject',['scss','script'], function () {
    console.log(dirs.src + '/*.html',dirs.dist)
    return gulp.src(dirs.src + '/*.html')
        .pipe(inject(injectStyles,{    ignorePath: [dirs.dist]}))
        .pipe(inject(injectScript,{    ignorePath: [dirs.dist]}))
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('concatJS', function () {
    return gulp.src(distOpstions.srcJS)
        .pipe(concat({path:'drag.js'}))
        .pipe(gulp.dest(dirs.build))
});
gulp.task('concatCSS', function () {
    return gulp.src(distOpstions.srcCss)
        .pipe(concat({path:'drag.css'}))
        .pipe(gulp.dest(dirs.build))
});
gulp.task('serve', ['watch'],function () {
    browserSync.init({
        server:{
            baseDir:dirs.dist
        }
    })
});
// uglify
gulp.task('serve:build', function () {
    gulp.start('concatJS');
    gulp.start('concatCSS');
});