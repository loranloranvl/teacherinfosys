var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var cachebust = require('gulp-cache-bust');

gulp.task('default', function() {
	console.log('gulp here');
});

gulp.task('fileinclude', function() {
	gulp.src('client/src/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('client'));
	gulp.src('manager/src/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('manager'));
});

gulp.task('less', function() {
	gulp.src('client/less/*.less')
		.pipe(less().on('error', function(err) {
		console.error(err.toString());
		this.emit('end');
	}))
		.pipe(gulp.dest('client/css'));
	gulp.src('manager/less/*.less')
		.pipe(less().on('error', function(err) {
		console.error(err.toString());
		this.emit('end');
	}))
		.pipe(gulp.dest('manager/css'));
});


gulp.task('watch', ['fileinclude', 'less'], function() {
	browserSync.init({
		server: {
			baseDir: './'
		},
		port: 3000
	});
	gulp.watch(['client/src/**/*.html', 'manager/src/**/*.html'], ['fileinclude', browserSync.reload]);
	gulp.watch(['client/less/**/*.less', 'manager/less/**/*.less'], ['less', browserSync.reload]);
});
















/*var gulp = require('gulp');
var watch = require('gulp-watch');
var fileinclude = require('gulp-file-include');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var cachebust = require('gulp-cache-bust');
var log = console.log;

var fi = fileinclude({
		prefix: '@@',
		basepath: '@file'
	});

function fileincludeHandler(location) {
	log('fileinclude');
	gulp.src('client/src/*.html')
		.pipe(fi)
		.pipe(gulp.dest('client'));
}

gulp.task('cfileinclude', function() {
	return gulp.src('client/src/*.html')
		.pipe(fi)
		.pipe(gulp.dest('client'));
})

gulp.task('mfileinclude', function() {
	return gulp.src('manager/src/*.html')
		.pipe(fi)
		.pipe(gulp.dest('manager'));
})

gulp.task('default', function() {
	watch(['client/src/*.html', 'manager/src/*.html'], function(vinyl) {
		
		if (vinyl.contents.length) {
			var location = vinyl.base.match((/client|manager/));
			gulp.start(location[0][0] + 'fileinclude');
		}
		
		fileincludeHandler('manager');
	});
})

*/