/**
 * Created by Lenovo on 2017/8/11.
 */
require(['http://res.wx.qq.com/open/js/jweixin-1.2.0.js', './scripts/lib/zepto.js', './scripts/lib/zoom.js?v=1.0.1', './scripts/wxconfig.js?v=1.12'], function () {
    $("body").on('touchmove', function (event) {
        event.preventDefault();
    });
    var zoomScale = 1, zoo = new zoom($);

    function zooCallback(pi) {
        zoomScale = pi;
    }

    zoo.calc(zooCallback);
    $(window).on('resize', function () {
        zoo.reSize(zooCallback);
    });

    function renderCss(name, val) {
        var prefix = ['-webkit-', '-moz-', '-o-'];
        var res = {};
        res[name] = val;

        for (var i = 0, item; item = prefix[i++];) {
            res[item + name] = val;
        }
        return res;
    }

    //test
    $('.tap-panel').on("touchstart", function (event) {
        // console.log(event)
        var e = event.touches[0];
        var css = renderCss('transform', 'translate3d(' + (e.clientX - (13 * zoomScale)) + 'px,' + (e.clientY - (13 * zoomScale)) + 'px,0)');
        $(".tap-dot").css(css).addClass('dot-tap');
    });

    $('.tap-panel').on("touchend", function (e) {
        $(".tap-dot").removeClass('dot-tap');
    });

    /***load***/
    var imgtotal = $("img").length + 4, imglen = 0;
    var lv = 100 / imgtotal;
    imgLoad('./img/load.png', function () {
        $(".load-img").addClass("runer");
    });

    imgLoad('./img/bike.png');
    $("img").each(function (i, v) {
        imgLoad($(v).attr("src"));
    });
    imgLoad("./img/tag_board.png");
    imgLoad("./img/tag_hand.png");
    imgLoad("./img/bike1.png");
    imgLoad("./img/bike2.png");

    function imgLoad(src, callback) {
        var img = new Image();
        imglen += 1;
        img.onload = function () {
            typeof callback == "function" && callback.call();

            imglen -= 1;
            $(".load-text").html(((imgtotal - imglen) * lv).toFixed(0) + '%');
            imglen == 0 && $(".loadding").addClass("hide") && $(".content").removeClass("hide") && forCount();
        }
        img.src = src;
    }

    function bike(obj) {
        this.obj = obj;
        this.tick = 0;
        this.len = 8.625;
        this.total = 14;
        this.isStop = false;
        this.speed = 16;

    }

    bike.prototype.run = function () {
        var _that = this;

        function dorun() {
            if (!_that.isStop) {
                _that.tick += 1;
                var pos = (_that.tick * _that.len - 0.5).toFixed(5);
                _that.obj.css({
                    "background-position": '-' + pos + 'rem 0'
                });
                _that.tick = _that.total <= _that.tick ? -1 : _that.tick;
                setTimeout(dorun, 1000 / _that.speed);
            }
        }

        dorun()
    }

    function bgmap() {
        this.width = 32.5;
        this.length = 8;
        this.obj = $('.swiper-wrapper');
        this.total = this.width * (this.length - 0.75);
        this.speed = 0.65;
        this.isStop = false;
        this.x = 0;
        this.onStop = function () {
        }
    }

    bgmap.prototype.run = function () {
        var _that = this;
        var st = +(new Date());

        function dorun() {
            if (!_that.isStop) {
                var t = new Date - st;
                _that.x = _that.speed / 1000 * 16 * t;

                _that.obj.css({
                    "transform": 'translateX(-' + _that.x + 'rem)',
                    "-webkit-transform": 'translateX(-' + _that.x + 'rem)',
                    "-moz-transform": 'translateX(-' + _that.x + 'rem)',
                    "transition-duration": '0s',
                    "-webkit-transition-duration": '0s',
                    "-moz-transition-duration": '0s',
                });
                _that.isStop = _that.x >= _that.total;
                _that.isStop && _that.onStop.call();
                setTimeout(dorun, 1000 / 60);
            }
            else {
//                    console.log(new Date() - st)
            }
        }

        dorun();
    }

    bgmap.prototype.onWatch = function (fn) {
        fn.call(this);
    }

    var match = function (v1, v2, bgm) {
        this.isStop = false;
        this.onWatch = function () {

        }
        this.mark = 20;
        var v = 3 / 1000;
        v1.totalCnt = 0;
        v1.clickCnt = 0;
        v1.boardHand = $('.board-hand');

        v2.totalCnt = 0;

        var eventinit = function () {
            $('.tap-panel').on("click", function (e) {
                v1.clickCnt += 1;
                v1.totalCnt += 1;

            })
        };
        var _that = this;
        var watch = function () {
            var st = +new Date();

            function dowatch() {
                if (_that.isStop) return;

                var t = new Date() - st;
                v2.totalCnt = t * v;


                var rotateval = v1.clickCnt * 20 + 41;
                rotateval = rotateval >= 242 ? 242 : rotateval

                v1.boardHand.css(renderCss("transform", 'rotateZ(' + rotateval + 'deg)'));

                var mk = Number((rotateval * 20 / 40.3).toFixed(0));

                _that.mark = mk > _that.mark ? mk : _that.mark;
                v1.clickCnt = 0;
                setTimeout(dowatch, 600);
            }

            setTimeout(dowatch, 100)
        }

        var bikeWatch = function () {
            var range = v2.totalCnt - v1.totalCnt;
            v2.obj.css({
                'transform': 'translateX(' + range * 0.45 + 'rem) scale(0.9)',
                '-webkit-transform': 'translateX(' + range * 0.45 + 'rem) scale(0.9)',
                '-moz-transform': 'translateX(' + range * 0.45 + 'rem) scale(0.9)',
                'transition': 'transform 0.6s',
                '-webkit-transition': '-webkit-transform 0.6s',
                '-moz-transition': '-moz-transform 0.6s',
            })
            setTimeout(bikeWatch, 16)
        }

        eventinit();
        watch();
        bikeWatch();
    }

    /***music****/
    function music() {
        var mus = document.getElementById('_game_kada');
        mus.volume = 0.1;
        this.play = function () {
            try {
                WeixinJSBridge.invoke('getNetworkType', {}, function (res) {
                    mus.play();
                });
            } catch (e) {

            }
            // mus.play();
        }
        this.stop = function () {
            mus.pause()
        }


        var mus_ending = document.getElementById('_game_ending');
        this.ending = {
            play: function () {
                try {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (res) {
                        mus_ending.play();
                    });
                } catch (e) {

                }
            }
        }
        return this;
    }



    /********黑米~~~go*********/
    function forCount() {

        wxReady(function (wxConfig) {

            var wxObj = this;
            wxConfig.onShare(wxObj, "我的藏地传奇，信不信我飙到了80公里？", 'http://bike.gsrunhe.com/index?type=gntc&callback=/cover.html', 'http://gn.toseetech.net/img/share.jpg')


            var val = 3;

            var mus = music();

            var mus_start = document.getElementById('_game_start');

            function count() {

                $(".heimi-go").html(val);
                mus_start.play();
                mus_start.onended = function () {
                    val -= 1;
                    val > -1 ? setTimeout(count, 1000) : go();
                }


            }

            function go() {

                $(".heimi-go").addClass("hide");
                $('.board').removeClass("hide");
                $('.tap-panel').removeClass("hide");
                $('.trip-txt').removeClass("hide");

                mus.play();

                gameReady(wxConfig, wxObj, mus);
            }

            count();
        });
    }

    function gameReady(wxConfig, wxObj, mus) {

        var v1 = new bike($('.bike')),
            v2 = new bike($('.bike2')),
            bgm = new bgmap();

        var mat = new match(v1, v2, bgm);


        v2.isStop = false;
        v2.run();
        v1.run();
        bgm.run();

        bgm.onStop = function () {

            v1.isStop = true;
            v2.isStop = true;
            mat.isStop = true;

            mus.ending.play();
            mus.stop();


            $(".trip-txt").hide();
            $(".board").hide();
            $(".tap-panel").hide();
            $(".game-over").removeClass("hide");
            marktag(mat.mark);
            wxConfig.onShare(wxObj, "我的藏地传奇，信不信我飙到了" + mat.mark + "公里？", 'http://bike.gsrunhe.com/index?type=gntc&callback=/cover.html', 'http://gn.toseetech.net/img/share.jpg')
        }

        function marktag(source) {
            var tag, slogan;
            if (source <= 40) {
                tag = "最高时速" + source + "km/h,轻松跑完全程!";
                slogan = "邀请好友欣赏甘南美景";
            }
            else if (source > 40 && source <= 60) {
                tag = "最高时速" + source + "km/h,高原缺氧有点累!";
                slogan = "有人比我更快？";
            }
            else if (source > 60 && source < 110) {
                tag = "最高时速" + source + "km/h,已然登峰造极!";
                slogan = "求挑战请点这里";
            }
            else if (source >= 110) {
                tag = "最高时速" + source + "km/h,已甩宝马两条街!";
                slogan = "求挑战请点这里";
            }

            $("#_mark_slogan").html(slogan);
            $("#_mark_tag").html(tag);
        }
    }

})