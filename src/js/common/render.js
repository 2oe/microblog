define(['jquery','handlebars'],function($,handlebars){
    function render(source, target, data) {
        var tpl = $(source).html();
        var template = handlebars.compile(tpl);
        var html = template(data);
        $(target).html(html);
    }
    return render;
})