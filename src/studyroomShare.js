import { ajax } from './others';

export const studyroomShare = (param) => {
    const SHANBAY_PREFIX_V2 = 'https://www.shanbay.com/api/v2';
    const LOCAL_PREFIX_V2 = 'http://www.daydayup.me/api/v2';
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

    Object.assign(shareContent, data.share_content);

    ajax({
        url: `${isDev ? LOCAL_PREFIX_V2 : SHANBAY_PREFIX_V2}/studyroom/posts/share/`,
        type: 'POST',
        data: {
            content: data.content,
            share_content: shareContent,
        },
        success: onSuccess,
        error: onError,
    });
};
