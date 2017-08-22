/**
 * Created by Lenovo on 2017/6/26.
 */
function validate() {
    var task = [];
    var vali = {
        add: function (val, msg, fn) {
            fn = typeof fn=='function'?fn:function () {

            };

            task.push(function (callback) {
                    if (val) {
                        return false;
                    }
                    fn.call() ;
                    callback.call(null, msg);
                    return true;
                }
            )
        },
        test:function (callback) {
            callback = typeof callback=='function'?callback:function () {

            };
            var hasError =false;
            for(var i=0,item;item=task[i++];){
                hasError = item(callback);
                // console.log(hasError)
                if(hasError){
                    break;
                }
            }
            return hasError;
        }
    }
    return vali;
}