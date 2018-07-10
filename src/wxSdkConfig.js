/* global wx */
import { isWechatUA } from './validator';
import { ajax } from './others';

const SHANBAY_HOST = 'https://www.shanbay.com';

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

const setWXConfig = (param, url) => {
    const {
        shareData,
        jsApiList = defaultJsApiList,
        onReady,
        onError,
        hostUrl = SHANBAY_HOST,
        isDebug = false,
    } = param;

    const { codename } = shareData;
    const replaceLinkHost = (link, host) => link.replace(/:\/\/(.*?)\//, `://${host}/`);

    ajax({
        url: `${hostUrl}/api/v1/wechat/jsconfig/?url=${encodeURIComponent(window.location.href)}${
            codename ? `&codename=${codename}` : ''
        }`,
        success: data => {
            shareData.link = replaceLinkHost(url || shareData.link, data.host);

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
                [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareQZone',
                ].forEach(jsApi => {
                    if (shareData && jsApiList.indexOf(jsApi) !== -1) {
                        const newShareData = $.extend({}, shareData, {
                            success() {
                                shareData.success && shareData.success(jsApi);
                            },
                        });
                        wx[jsApi](newShareData);
                    }
                });
                onReady &&
                    onReady({
                        appId: data.appid,
                        timestamp: data.timestamp,
                        nonceStr: data.noncestr,
                        signature: data.signature,
                    });
            });
            wx.error(err => {
                onError && onError(err);
            });
        },
    });
};

/**
 * wxSdkConfig
 *
 * @param {object} param 参数
 * 参数说明：
 *  shareData: Object, 用以分享的信息，{title, link, imgUrl, success, cancel, codename},
 *  trackObject: Object, track链接,
 *  jsApiList: Array, 需要使用的JS接口列表,
 *  onReady: 成功验证后的回调函数,
 *  hostUrl: 默认值为 https://www.shanbay.com
 *  isDebug: 是否开启调试模式
 */

export const wxSdkConfig = param => {
    const { onReady, trackObject = null, hostUrl = SHANBAY_HOST } = param;
    if (isWechatUA(window.navigator.userAgent)) {
        if (trackObject) {
            ajax({
                url: `${hostUrl}/api/v2/track/short_urls/`,
                type: 'POST',
                data: trackObject,
                success: data => {
                    const { wechat } = data;
                    setWXConfig(param, wechat);
                },
            });
        } else {
            setWXConfig(param);
        }
    } else {
        onReady && onReady();
    }
};
