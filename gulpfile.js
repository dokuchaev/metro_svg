'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    csscomb = require('gulp-csscomb'),
    // uncss = require('gulp-uncss'),
    // sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'app/*.html',
        js: 'app/js/*.js',
        style: 'app/css/*.css',
        img: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/css/**/*.css',
        img: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "test"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    var assets = useref.assets();
    gulp.src(path.src.html) 
        .pipe(rigger())
        .pipe(useref())

        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(rigger()) 
        .pipe(sourcemaps.init()) 
        .pipe(uglify()) 
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', function () {
    gulp.src(path.src.style) 
        .pipe(sourcemaps.init())
        .pipe(prefixer({
     browsers: ['last 35 versions'],
     cascade: false
       }))
     // .pipe(uncss({
     //        html: ['app/index.html']
     //    }))
        .pipe(cssmin())
        .pipe(csscomb())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('images:build', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});



gulp.task('build', [
    'html:build',
    'js:build',
    'css:build',
    'fonts:build',
    'images:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);




// var gulp=require('gulp'),
// 	wiredep = require('wiredep').stream;
// 	 useref = require('gulp-useref'),
//     gulpif = require('gulp-if'),
//     uglify = require('gulp-uglify'),
//     minifyCss = require('gulp-minify-css'),
//     clean = require('gulp-clean');
//     livereload = require('gulp-livereload'),
//     connect = require('gulp-connect'),
//         autoprefixer = require('gulp-autoprefixer');
// // Clean
// gulp.task('clean', function () {
//     return gulp.src('dist', {read: false})
//         .pipe(clean());
// });

// // Build
// gulp.task('build', function () {
//     var assets = useref.assets();
 
//     return gulp.src('app/*.html')
//         .pipe(assets)
//         .pipe(gulpif('*.js', uglify()))
//         .pipe(gulpif('*.css', minifyCss()))
//         .pipe(assets.restore())
//         .pipe(useref())
//         .pipe(gulp.dest('dist'));
// });

// // bower
// gulp.task('bower', function () {
//   gulp.src('./app/index.html')
//     .pipe(wiredep({
//     directory : "app/bower_components",
//     }))
//     .pipe(gulp.dest('./app'));
// });

// // watch
// gulp.task('watch', function(){
// 	gulp.watch('bower.json', ['bower']);
//     gulp.watch('app/css/*.css',['css'])
//     gulp.watch('app/index.html',['html'])
// })

// // server connect
// gulp.task('connect', function() {
//   connect.server({
//     root: 'app',
//     livereload: true
//   });
// });

// // html
// gulp.task('html', function () {
//     gulp.src('app/index.html')
//         .pipe(connect.reload());
// })

// // css
// gulp.task('css', function () {
//     gulp.src('app/css/main.css')
//     .pipe(autoprefixer({
//     browsers: ['last 35 versions'],
//     cascade: false
//       }))
//     .pipe(gulp.dest('app/css'))
//         .pipe(connect.reload());
// });

// gulp.task('default', ['connect', 'html','css','watch']);