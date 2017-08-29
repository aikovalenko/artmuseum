

var gulp = require('gulp'),
	bump = require('gulp-bump'),
	plumber = require('gulp-plumber'),
//	hamlc = require('gulp-haml-coffee'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
	rigger = require('gulp-rigger'),
	browserSync = require("browser-sync").create(),
	//zip = require('gulp-zip'),
	include = require('gulp-file-include'),
	cleanCSS = require('gulp-clean-css'),
    csscomb = require('gulp-csscomb'),
    uglify = require('gulp-uglify'),
	cache = require('gulp-cache'),
	svgSprite = require("gulp-svg-sprites");
   

var path = {
	bump: ['./bower.json', './package.json'],
	zip: {
		source: 'docs/*',
		dest: ''
	},
	docs: {
		html: 'docs/',
		js: 'docs/js/',
		css: 'docs/css/',
		img: 'docs/images/',
		fonts: 'docs/fonts/',
		raw: 'docs/raw'
	},
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/images/',
		fonts: 'build/fonts/',
		raw: 'build/raw'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/**/*.js',
		jsLibs: 'src/js/**/libs.js',
		style: 'src/css/*.scss',
		styleLibs: 'src/css/libs.scss',
		img: 'src/images/**/*.*',
		fonts: 'src/fonts/**/*.*',
		raw: 'src/raw/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/css/**/*.scss',
		img: 'src/images/**/*.*',
		fonts: 'src/fonts/**/*.*',
		raw: 'src/raw/**/*.*'
	},
	clean: {
		build: './build',
		docs: './docs'
	}
};

var config = {
	server: {
		baseDir: "./build"
	},
	host: 'localhost',
	port: 9000,
	logPrefix: "browsersync",
	ui: {
    port: 3002
	}
};

gulp.task('sprites', function () {
    return gulp.src('src/images/svg/*.svg')
        .pipe(svgSprite({
            cssFile: "scss/_sprite.scss"
        }))
        .pipe(gulp.dest("src/css/sprites"));
});

gulp.task('html:build', function () {
	gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(include({cache: false, indent: true}))
//		.pipe(hamlc())
		.pipe(gulp.dest(path.build.html))
    .on('end', function () {
      browserSync.reload();
    });
});

gulp.task('html:docs', function () {
	gulp.src(path.src.html)
		.pipe(include({cache: false, indent: true}))
//		.pipe(hamlc())
		.pipe(gulp.dest(path.docs.html));
});

gulp.task('style:build', function () {
	gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
    .on('end', function () {
      browserSync.reload();
    });
});

gulp.task('style:docs', function () {
	gulp.src(path.src.style)
		.pipe(sass())
		.pipe(prefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		// .pipe(cleanCSS())
        .pipe(csscomb())
		.pipe(gulp.dest(path.docs.css));
    gulp.src(path.src.styleLibs)
        .pipe(sass())
        .pipe(prefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cleanCSS())
        // .pipe(csscomb())
        .pipe(gulp.dest(path.docs.css));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ])))
        .pipe(gulp.dest(path.build.img))
        .on('end', function () {
            browserSync.reload();
        });
});

gulp.task('image:docs', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ]))
        .pipe(gulp.dest(path.docs.img));
});

gulp.task('fonts:build', function () {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
    .on('end', function () {
      browserSync.reload();
    });
});

gulp.task('fonts:docs', function () {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.docs.fonts));
});

gulp.task('raw:build', function () {
    gulp.src(path.src.raw)
        .pipe(gulp.dest(path.build.raw))
        .on('end', function () {
            browserSync.reload();
        });
});
gulp.task('raw:docs', function () {
    gulp.src(path.src.raw)
        .pipe(gulp.dest(path.docs.raw));
});

gulp.task('js:build', function () {
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.js))
    .on('end', function () {
      browserSync.reload();
    });
});

gulp.task('js:docs', function () {
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(gulp.dest(path.docs.js));
	gulp.src(path.src.jsLibs)
		.pipe(rigger())
        .pipe(uglify())
		.pipe(gulp.dest(path.docs.js));
});

gulp.task('build', ['clean:build'], function() {
	gulp.start('project:build');
});

gulp.task('docs:major', ['clean:docs'], function() {
	gulp.start('project:docs');
	gulp.src(path.bump)
		.pipe(bump({type: 'major'}))
		.pipe(gulp.dest('./'));
});

gulp.task('docs:minor', ['clean:docs'], function() {
	gulp.start('project:docs');
	gulp.src(path.bump)
		.pipe(bump({type: 'minor'}))
		.pipe(gulp.dest('./'));
});

gulp.task('docs:patch', ['clean:docs'], function() {
	gulp.start('project:docs');
	gulp.src(path.bump)
		.pipe(bump())
		.pipe(gulp.dest('./'));
});

gulp.task('docs:prerelease', ['clean:docs'], function() {
	gulp.start('project:docs');
	gulp.src(path.bump)
		.pipe(bump({type: 'prerelease'}))
		.pipe(gulp.dest('./'));
});

gulp.task('docs', ['clean:docs'], function() {
	gulp.start('project:docs');
});

gulp.task('project:build', ['html:build', 'style:build', 'image:build', 'fonts:build', 'js:build', 'raw:build']);

gulp.task('project:docs', ['html:docs', 'style:docs', 'image:docs', 'fonts:docs', 'js:docs', 'raw:docs']);

/* Настроить автоматическую подготовку архива */
gulp.task('zip', ['docs'], function() {
	gulp.src(path.zip.source)
		.pipe(zip('docs.zip'))
		.pipe(gulp.dest(path.zip.dest));
});


gulp.task('watch', ['build'], function() {
	gulp.watch([path.watch.html], ['html:build']);
	gulp.watch([path.watch.style], ['style:build']);
	gulp.watch([path.watch.js], ['js:build']);
	gulp.watch([path.watch.img], ['image:build']);
	gulp.watch([path.watch.fonts], ['fonts:build']);
	gulp.watch([path.watch.raw], ['raw:build']);
});

gulp.task('webserver', ['build'], function () {
	browserSync.init(config);
});

gulp.task('clean:build', function (cb) {
	rimraf(path.clean.build, cb);
});

gulp.task('clean:docs', function (cb) {
	rimraf(path.clean.docs, cb);
});

gulp.task('default', ['webserver', 'watch']);
