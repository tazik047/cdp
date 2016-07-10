/*npm install --save-dev gulp glob gulp-uglify gulp-cssnano gulp-concat*/
(function () {
    var gulp = require("gulp"),
        uglify = require("gulp-uglify"),
        nano = require("gulp-cssnano"),
        fs = require("fs"),
        concat = require("gulp-concat"),
        rimraf = require("gulp-rimraf"),
        plumber = require("gulp-plumber"),
        sequence = require("gulp-sequence"),
        less = require('gulp-less');

    var paths = {
        libs: "./assets/js/libs/**/*.js",
        css: "./source/css/*.css",
        cssDir: "./source/css",
		less: "./source/css/less/*.less",
        bower: "./bower_components/",
        output: {
            js: './js',
            css: './css',			
            fonts: './fonts'
        }
    };

    gulp.task("css-clean", function () {
        return gulp.src(paths.output.css + "/*.css", { read: false })
            .pipe(plumber())
            .pipe(rimraf());
    });

	gulp.task("less", function(){
		return gulp.src(paths.less)
				.pipe(less({
					paths: ['.']
				}))
				.pipe(gulp.dest(paths.cssDir));
	});
	
    gulp.task("styles", function () {
			
        return gulp.src(paths.css)
            .pipe(plumber())
            .pipe(concat("all.css"))
            .pipe(nano({zindex:false}).on('error', console.log))
            .pipe(gulp.dest(paths.output.css));
    });
	
	gulp.task("js-vendor", function () {
        var i, source;

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
    });

    gulp.task("css-vendor", function () {
        var i, source;

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
    });

    gulp.task("fonts", function() {
        gulp.src([bower("font-awesome/fonts/*.*")])
            .pipe(plumber())
            .pipe(gulp.dest(paths.output.fonts));
    });

    gulp.task('watch', function () {
        gulp.watch(paths.less, ['less']);
        return gulp.watch(paths.css, ['styles']);
    });

    gulp.task("init", sequence(["css-clean"], "js-vendor", "css-vendor", "fonts", "less", "styles"));
    gulp.task("default", sequence(["css-clean"], "js-vendor", "css-vendor", "fonts", "less", "styles", "watch"));

    function bower(p) {
        return paths.bower + p;
    }
})()