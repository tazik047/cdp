/*npm install --save-dev gulp glob gulp-uglify gulp-cssnano gulp-concat*/
(function () {
    var gulp = require("gulp"),
        glob = require("glob"),
        uglify = require("gulp-uglify"),
        nano = require("gulp-cssnano"),
        fs = require("fs"),
        concat = require("gulp-concat"),
        rimraf = require("gulp-rimraf"),
        plumber = require("gulp-plumber"),
        sequence = require("gulp-sequence");


    var paths = {
        js: "./assets/js/**/*.js",
        components: "./assets/js/modules/*/*.js",
        libs: "./assets/js/libs/**/*.js",
        css: "./assets/css/custom/**/*.css",
        csslibs: "./assets/css/libs/**/*.css",
        api: "./assets/js/api/**/*.js",
        'const': "./assets/js/const/**/*.js",
        global: "./assets/js/global/**/*.js",
        bower: "./bower_components/",
        output: {
            js: './js',
            css: './css',
            fonts: './fonts'
        },
    };

    gulp.task("js-clean", function() {
        return gulp.src(paths.output.js + "/**/*.js", { read: false })
            .pipe(plumber())
            .pipe(rimraf());
    });

    gulp.task("css-clean", function () {
        return gulp.src(paths.output.css + "/**/*.css", { read: false })
            .pipe(plumber())
            .pipe(rimraf());
    });

    gulp.task("scripts", function () {
        glob(paths.components, function (er, files) {
            var i, result = [];
            for (i = 0; i < files.length; i++) {
                result.push(files[i].substr(0, files[i].lastIndexOf("/")));
            }

            var folders = uniq_fast(result);

            for (i = 0; i < folders.length; i++) {
                gulp.src(folders[i] + "/**/*.js")
                    .pipe(plumber())
                    .pipe(concat(folders[i].substr(folders[i].lastIndexOf("/")) + ".js"))
                    //.pipe(uglify({}).on("error", console.log))
                    .pipe(gulp.dest(paths.output.js));
            }

            gulp.src(paths.libs)
                .pipe(plumber())
                .pipe(concat("libs.js"))
                //.pipe(uglify().on("error", console.log))
                .pipe(gulp.dest(paths.output.js));

            gulp.src([paths.global, paths['const']])
                .pipe(plumber())
                .pipe(concat("const.js"))
                .pipe(gulp.dest(paths.output.js));

            gulp.src(paths.api)
                .pipe(plumber())
                .pipe(concat("api.js"))
                .pipe(uglify().on("error", console.log))
                .pipe(gulp.dest(paths.output.js));

            return gulp.src("./assets/js/*.js")
                .pipe(plumber())
                .pipe(concat("init.js"))
                .pipe(uglify().on("error", console.log))
                .pipe(gulp.dest(paths.output.js));
        })
    })

    gulp.task("styles", function () {
        gulp.src(paths.csslibs)
            .pipe(plumber())
            .pipe(concat("libs.css"))
            .pipe(nano({zindex:false}).on('error', console.log))
            .pipe(gulp.dest(paths.output.css));

        return gulp.src(paths.css)
            .pipe(plumber())
            .pipe(concat("styles.css"))
            .pipe(nano({zindex:false}).on('error', console.log))
            .pipe(gulp.dest(paths.output.css));
    })

    gulp.task("js-vendor", function () {
        var i, j, source;

        source = JSON.parse(fs.readFileSync("./vendor-modules.json"));

        for (i = 0; i < source.js.bower.copy.length; i++) {
            source.js.bower.copy[i] = bower(source.js.bower.copy[i]);
        }

        for (i = 0; i < source.js.bower.concat.length; i++) {
            source.js.bower.concat[i] = bower(source.js.bower.concat[i]);
        }

        gulp.src(source.js.bower.copy.concat(source.js.copy))
            .pipe(plumber())
            .pipe(gulp.dest(paths.output.js));

        return gulp.src(source.js.bower.concat.concat(source.js.concat))
            .pipe(plumber())
            .pipe(concat("vendor.js"))
            .pipe(uglify().on("error", console.log))
            .pipe(gulp.dest(paths.output.js));
    })

    gulp.task("css-vendor", function () {
        var i, j, source;

        source = JSON.parse(fs.readFileSync("./vendor-modules.json"));

        for (i = 0; i < source.css.bower.copy.length; i++) {
            source.css.bower.copy[i] = bower(source.css.bower.copy[i]);
        }

        for (i = 0; i < source.css.bower.concat.length; i++) {
            source.css.bower.concat[i] = bower(source.css.bower.concat[i]);
        }

        gulp.src(source.css.bower.copy.concat(source.css.copy))
            .pipe(plumber())
            .pipe(gulp.dest(paths.output.css));

        return gulp.src(source.css.concat.concat(source.css.bower.concat))
            .pipe(plumber())
            .pipe(concat("vendor.css"))
            .pipe(gulp.dest(paths.output.css));
    })

    gulp.task("fonts", function() {
        gulp.src([bower("font-awesome/fonts/*.*"), "./vendor/fonts/**/*.*"])
            .pipe(plumber())
            .pipe(gulp.dest(paths.output.fonts));
    });

    gulp.task('watch', function () {
        gulp.watch(paths.css, ['styles']);
        return gulp.watch(paths.js, ['scripts']);
    });

    gulp.task("init", sequence(["js-clean", "css-clean"], "js-vendor", "css-vendor", "fonts", "styles", "scripts"));
    gulp.task("default", sequence(["js-clean", "css-clean"], "js-vendor", "css-vendor", "fonts", "styles", "scripts", "watch"));

    function uniq_fast(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for (var i = 0; i < len; i++) {
            var item = a[i];
            if (seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = item;
            }
        }

        return out;
    }

    function bower(path) {
        return paths.bower + path;
    }
})()