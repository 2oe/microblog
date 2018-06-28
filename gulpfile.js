var gulp = require('gulp');
var server = require('gulp-webserver');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sequence = require('gulp-sequence');
var url = require('url');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var data = require('./data/data.json');
var obj = [
    {
        user: 'zs',
        pwd: '123'
    },{
        user: '12',
        pwd: '12'
    }
]
gulp.task('sass', function () {
    gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        'browsers':['last 2 versions','Android > 4.0']
    }))
    .pipe(gulp.dest('src/css'));
})
gulp.task('server',function(){
    gulp.src('src')
    .pipe(server({
        port:8282,
        middleware:function(req,res){
            var pathname = url.parse(req.url).pathname;
            if(pathname === '/favicon.ico'){
                return false;
            }
            if (pathname === '/api/list') {
                res.end(JSON.stringify(data));
            } else if (pathname === '/api/login') {
                var arr = [];
                req.on('data',function(chunk){
                    arr.push(chunk);
                })
                req.on('end',function(){
                    var json = querystring.parse(Buffer.concat(arr).toString());
                    var isOk = obj.some(function(item){
                        return item.user === json.user && item.pwd == json.pwd;
                    })
                    if(isOk){
                        res.end(JSON.stringify({code:'1',msg:'登录成功'}));
                    } else {
                        res.end(JSON.stringify({code:'0',msg:'登录失败'}));
                    }
                })
            } else {
                pathname = pathname === '/'? '/index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname,'src',pathname)));
            }
        }
    }))
})
gulp.task('uglify', function () {
    gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
})
gulp.task('watch', function () {
    gulp.watch('src/scss/*.scss',['sass']);
})
gulp.task('dev',function(cb){
    sequence('sass','watch','server',cb);
})