const { src, dest, series, parallel, watch } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserify = require('gulp-browserify');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();

function html() {
    return src('src/index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('build'))
        .pipe(browserSync.stream());
}

function css() {
    return src('src/css/index.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(rename('main.css'))
        .pipe(dest('build'))
        .pipe(browserSync.stream());
}

function js() {
    return src('src/js/index.js')
        .pipe(browserify({ transform: [babelify.configure({ presets: ['@babel/preset-env'] })] }))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(rename('main.bundle.js'))
        .pipe(dest('build'))
        .pipe(browserSync.stream());
}

function images() {
    return src('src/assets/*')
        .pipe(imagemin())
        .pipe(dest('build/assets'))
        .pipe(browserSync.stream());
}

function clean() {
    return del(['./build/*']);
}

function dev() {
    browserSync.init({
        server: './build'
    });
    watch('src/*.html', html);
    watch('src/css/*.scss', css);
    watch('src/js/**/*.js', js);
    watch('src/assets/*', images);
}

function build() {
    return series(clean, parallel(js, css), images, html);
}

exports.build = build();
exports.dev = series(clean, build(), dev);