var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var cachebust = require('gulp-cache-bust');
var watch = require('gulp-watch');

gulp.task('default', function() {
	console.log('gulp here');
});

gulp.task('include-client', function() {
	return gulp.src('client/src/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('client'));
});

gulp.task('include-client-watch', ['include-client'], function(done) {
	browserSync.reload();
	done();
})

gulp.task('include-manager', function() {
	return gulp.src('manager/src/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('manager'));
});

gulp.task('include-manager-watch', ['include-manager'], function(done) {
	browserSync.reload();
	done();
})

gulp.task('less-client', function() {
	return 	gulp.src('client/less/*.less')
		.pipe(less().on('error', function(err) {
			console.error(err.toString());
			this.emit('end');
		}))
		.pipe(gulp.dest('client/css'));
})

gulp.task('less-client-watch', ['less-client'], function(done) {
	browserSync.reload();
	done();
})

gulp.task('less-manager', function() {
	return gulp.src('manager/less/*.less')
		.pipe(less().on('error', function(err) {
			console.error(err.toString());
			this.emit('end');
		}))
		.pipe(gulp.dest('manager/css'));
});

gulp.task('less-manager-watch', ['less-manager'], function(done) {
	browserSync.reload();
	done();
})

var inits = [
	'include-client',
	'include-manager',
	'less-client',
	'less-manager'
];

var scripts = [
	'client/js/*.js', 
	'manager/js/*.js',
	'shared/common.js'
];

gulp.task('watch', inits, function() {
	browserSync.init({
		server: {
			baseDir: './'
		},
		port: 3000,
		browser: "chrome",
		cors: true
	});
	gulp.watch(['client/src/*.html', 'client/src/partials/*.html'],
		['include-client-watch']);
	gulp.watch(['manager/src/*.html', 'manager/src/partials/*.html'],
		['include-manager-watch']);
	gulp.watch('client/less/*.less', ['less-client-watch']);
	gulp.watch('manager/less/*.less', ['less-manager-watch']);
	gulp.watch(scripts).on('change', browserSync.reload);
});

gulp.task('cachebust', function() {
    return gulp.src('./**/src/**/*.html')
        .pipe(cachebust({
            type: 'timestamp'
        }))
        .pipe(gulp.dest('./'));
});