/**
 * Created by Lenovo on 2017/6/21.
 * 文件仅用于站点信息配置，不做其他特殊处理。
 * 文件应在其他js代码执行之前进行加载。
 */

require(['../scripts/lib/zepto.js'], function () {
    window.htconfig = __config = {
        host: "http://139.129.205.178:8088/tuj/"
    }
    window.GetQueryStr = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        return r != null ? decodeURIComponent(r[2]) : null;
    }
    $.ajax = function (base) {
        return function (opt) {

            if (opt && opt.success) {
                opt.url = opt.islocal == true ? opt.url : __config.host + opt.url;
                opt.success = function (successfn) {
                    return function (res) {
                        console.log("Success=====>>is act!");

                        successfn.call(null, res);
                    }
                }(opt.success);
            }
            base.call(null, opt);
        }
    }($.ajax);
})
