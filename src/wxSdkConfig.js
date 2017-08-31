/* global wx */
import { isWechatUA } from './validator';
import { ajax } from './others';

const SHANBAY_PREFIX_V1 = 'https://www.shanbay.com/api/v1';
const LOCAL_PREFIX_V1 = 'http://local.daydayup.me:3000/api/v1';

/*
默认的JS接口列表：
    onMenuShareTimeline: 分享到朋友圈,
    onMenuShareAppMessage: 分享给朋友,
    onMenuShareQQ: 分享到QQ,
    onMenuShareQZone: 分享到QQ空间,
*/

const defaultJsApiList = [
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareQZone',
];

/*
参数说明：
    shareData: Object, 用以分享的信息，{title, link, imgUrl, success, cancel}
    jsApiList: Array, 需要使用的JS接口列表,
    onReady: 成功验证后的回调函数,
    isDev: 是否为开发环境，默认为false,
    isDebug: 是否开启调试模式
*/

export const wxSdkConfig = (param) => {
    const { shareData,
            jsApiList = defaultJsApiList,
            onReady,
            isDev = false,
            isDebug = false,
        } = param;
    if (isWechatUA(window.navigator.userAgent)) {
        ajax({
            url: `${isDev ? LOCAL_PREFIX_V1 : SHANBAY_PREFIX_V1}/wechat/jsconfig/?url=${encodeURIComponent(window.location.href)}`,
            success: (data) => {
                // wx.config() 函数会修改jsApiList参数
                const jsApiListCopy = jsApiList.concat();
                const config = {
                    debug: isDebug,
                    appId: data.appid,
                    timestamp: data.timestamp,
                    nonceStr: data.noncestr,
                    signature: data.signature,
                    jsApiList: jsApiListCopy,
                };
                wx.config(config);
                wx.ready(() => {
                    ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'].forEach((jsApi) => {
                        if (shareData && jsApiList.indexOf(jsApi) !== -1) {
                            const newShareData = $.extend({}, shareData, {
                                success() {
                                    shareData.success && shareData.success(jsApi);
                                }
                            })
                            wx[jsApi](newShareData);
                        }
                    });
                    onReady && onReady({
                        appId: data.appid,
                        timestamp: data.timestamp,
                        nonceStr: data.noncestr,
                        signature: data.signature,
                    });
                });
            },
        });
    } else {
        onReady && onReady();
    }
};
