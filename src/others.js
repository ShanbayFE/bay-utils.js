import { formatDate } from './format';

export const getSearchValue = (searchName, url = window.location.href) => {
    const name = searchName.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ''));
};

export const getCookie = (cookie, name) => {
    const regStr = `; ${name}=(\\w+)`;
    const reg = new RegExp(regStr, 'g');
    const matched = reg.exec(`; ${cookie}`);
    return matched && matched[1];
};

export const ajax = (options, isOriginal = false, configure) => {
    $.support.cors = true;
    const config = $.extend({}, {
        LOGIN_URL: '/web/account/login',
    }, configure);

    const defaultOptions = {
        contentType: 'application/json',
        crossDomain: true,
        xhrFields: {
            withCredentials: true,
        },
        headers: {
            'X-CSRFToken': getCookie(document.cookie, 'csrftoken'),
        },
    };

    const primaryOptions = {
        success: (json) => {
            if (json.status_code === 401 || json.status_code === 403) {
                window.location.href = `${config.LOGIN_URL}/?next=${location.pathname}${location.search}`;
            } else if (json.status_code === 0) {
                options.success && options.success(json.data);
            } else {
                options.error && options.error(json.status_code, json.msg || '请求失败，请稍后重试');
            }
        },
        error: (xhr, textStatus) => {
            options.error && options.error(xhr.status, `${textStatus}(${xhr.status})`);
        },
    };

    if (options.data && typeof options.data === 'object') {
        options.data = JSON.stringify(options.data); // eslint-disable-line
    }
    if (isOriginal) {
        $.ajax($.extend({}, defaultOptions, options));
    } else {
        $.ajax($.extend({}, defaultOptions, options, primaryOptions));
    }
};

// export const getAppVersions = (userAgent = navigator.userAgent) =>
//     userAgent.match(/shanbayappversion\/(\d+)\s/);

export const getDayDiff = (day1, day2) => {
    const newDay1 = new Date(formatDate(day1));
    const newDay2 = new Date(formatDate(day2));
    return Math.floor((new Date(newDay2) - new Date(newDay1)) / (1000 * 60 * 60 * 24));
};

export const getFrontendVersion = (userAgent = window.navigator.userAgent) => {
    const uaFrontEndKey = userAgent.match(/Frontend\/(\d+).(\d+)/gi);

    if (!uaFrontEndKey || !uaFrontEndKey.length) {
        return null;
    }

    return parseFloat(uaFrontEndKey[0].replace(/Frontend\//gi, ''));
};

/*
 * @params str {String}
 * @return urls {Array}
 */
export const getUrlsFromStr = (str) => {
    const urlPattern = new RegExp('https?:\\/\\/[-A-Za-z0-9+&@#\\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\\/%=~_|]', 'ig');
    return str.match(urlPattern);
};

export const uniqArr = arr => [...new Set(arr)];
// export const uniqArr = (arr) => {
    // const newArr = [];
    // arr.forEach((item, index) => {
    //     const firstIndex = arr.indexOf(item);
    //     if (firstIndex === index && arr[firstIndex] === item) {
    //         newArr.push(item);
    //     }
    // });
    // return newArr;
// }

/*
 * @params str {String}
 * @return newStr {String}
 */
export const transformUrlToAnchor = (str) => {
    let newStr = str;
    const urls = uniqArr(getUrlsFromStr(str));
    urls.forEach((url) => {
        const anchor = `<a href='${url}' target='_blank'>${url}</a>`;
        newStr = newStr.replace(new RegExp(`${url}`, 'gi'), anchor);
    });
    return newStr;
};
