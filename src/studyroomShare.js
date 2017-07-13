import { ajax } from './others';
import { merge } from './validator';

export const studyroomShare = (param) => {
    const SHANBAY_PREFIX_V2 = 'https://www.shanbay.com/api/v2';
    const LOCAL_PREFIX_V2 = 'http://local.daydayup.me/api/v2';
    const SHANBAY_LOGO_URL = 'https://static.baydn.com/baydn/public/images/logo-s.png';

    const {
        data,
        isDev = false,
        onSuccess,
        onError,
    } = param;

    const shareContent = {
        title: document.title,
        image_url: SHANBAY_LOGO_URL,
        redirect_url: window.location.href,
    };

    merge(data.share_content, shareContent);

    ajax({
        url: `${isDev ? LOCAL_PREFIX_V2 : SHANBAY_PREFIX_V2}/studyroom/posts/share/`,
        type: 'POST',
        data,
        success: onSuccess,
        error: onError,
    });
};
