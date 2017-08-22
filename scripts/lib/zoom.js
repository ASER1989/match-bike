/**
 * Created by Lenovo on 2017/6/19.
 */
var zoom = function ($) {

    function calc(callback, pattern) {
        pattern = pattern == null && Object.prototype.toString.call(callback) == "[object String]" ? callback : pattern;
        callback = typeof callback == "function" ? callback : function () {
        };

        // var width = $(window).width();
        var width = getWidth(pattern);
        var pi = width / 320;
        var fontSize = 16;

        var el = document.createElement("style");
        el.setAttribute("id", "_html_font_size");
        el.innerHTML = "html{ font-size:" + fontSize * pi + "px !important}";
        $("head").append(el);

        callback.call(null,pi);
    }

    function getWidth(pattern) {
        var w = $(window).width(), h = $(window).height();
        w = pattern == "horizontal" ? (w > h ? h : w) : w;
        return w;
    }


    return {
        calc: calc,
        reSize: function (pattern) {
            {
                $("#_html_font_size").remove();
                calc(pattern);
            }
        }
    }
}