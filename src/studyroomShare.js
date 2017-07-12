import { ajax } from './others';

export const studyroomShare = (
    userContent,
    shareContent,
    onSuccess = () => {},
    onError = () => {},
) => {
    const SHANBAY_PREFIX_V2 = 'https://www.shanbay.com/api/v2';

    const {
        title,
        content,
        image_url,
        redirect_url,
    } = shareContent;

    const data = {
        content: userContent,
        share_content: {
            title,
            content,
            image_url,
            redirect_url,
        },
    };

    ajax({
        url: `${SHANBAY_PREFIX_V2}/studyroom/posts/share/`,
        type: 'POST',
        data,
        success: onSuccess,
        error: onError,
    });
};
