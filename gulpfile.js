var { src, dest, watch, parallel } = require("gulp"),
    pug = require('gulp-pug'),
    sass = require('gulp-sass')(require('sass'));

function buildStyles() {
    return src('./styles/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./'));
    };
    
function buildTemplates() {  // create a task called build (we can run it using 'gulp build' in terminal)
    return src('./templates/*.pug') // set gulp searching for pug templates with anything ending with .pug
        .pipe(pug()) // run files throgh gulp-pug
        .pipe(dest('./')) // place html in dist
    }


function watchFiles(cb) {
    watch('./templates/*.pug', buildTemplates);
    watch('./styles/*.sass', buildStyles);
}

exports.build = parallel(buildStyles, buildTemplates);

exports.watch = watchFiles;

exports.default = parallel(buildStyles, buildTemplates);