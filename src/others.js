import { formatDate } from './format';
import { isArray } from './validator';

const SHANBAY_HOST_REG = /^https:\/\/(www|rest)\.shanbay\.com/;

export const getSearchValue = (searchName, url = window.location.href) => {
    const name = searchName.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ''));
};

export const getCookie = (cookie, cname) => {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    const result = ca.find(el => el.indexOf(name) > -1);
    return result.substring((name.length + result.indexOf(name)), result.length) || '';
};

export const ajax = (options, isOriginal = false, configure) => {
    $.support.cors = true;

    options.type = options.type || options.method || 'GET';

    if (options.method) {
        console.warn('Ajax does\'t support \'method\' parameter! Please replace it by \'type\'!');
    }

    // 非admin地址，api v1,v2接口相对于当前根路径
    if (!/admin/.test(window.location.host)) {
        options.url = options.url.replace(SHANBAY_HOST_REG, '');
    }


    const isVersionThreeAPI = /\/api\/v3\/|apiv3/.test(options.url);

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
            Accept: 'application/json',
        },
    };

    const checkAuth = (status) => {
        if (status === 401) {
            window.location.href = `${config.LOGIN_URL}/?next=${encodeURIComponent(window.location.href)}`;
        }
    };

    const primaryOptions = {
        success: (json) => {
            if (isVersionThreeAPI) {
                options.success && options.success(json);
                return;
            }
            checkAuth(json.status_code);
            if (json.status_code === 0) {
                options.success && options.success(json.data);
            } else {
                if (json.status_code === 422) {
                    json.msg = ((errors) => {
                        if (!errors) {
                            return json.msg;
                        }

                        let result = [];
                        $.each(errors, (field, errorArr) => {
                            const fieldErrors = errorArr.map(item => `(${field}): ${item}`);
                            result = result.concat(fieldErrors);
                        });

                        return result.join('\n');
                    })(json.errors);
                }

                options.error && options.error(json.status_code, json.msg || '请求失败，请稍后重试');
            }
        },
        error: (xhr, textStatus) => {
            checkAuth(xhr.status);
            options.error && options.error(xhr.status, `${textStatus}(${xhr.status})`);
        },
    };


    if (options.data && typeof options.data === 'object' && options.type !== 'GET') {
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

// export const uniqArr = arr => [...new Set(arr)];
export const uniqArr = (arr = []) => {
    const newArr = [];

    if (!isArray(arr)) {
        return newArr;
    }

    arr.forEach((item, index) => {
        const firstIndex = arr.indexOf(item);
        if (firstIndex === index && arr[firstIndex] === item) {
            newArr.push(item);
        }
    });
    return newArr;
};

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

export const getAppNameFromAgent = (agent) => {
    let name;

    const appsData = {
        'com.shanbay.words': 'bdc',
        'com.shanbay.news': 'news',
        'com.shanbay.listen': 'listen',
        'com.shanbay.speak': 'speak',
        'com.shanbay.reader': 'read',
        'com.shanbay.book': 'read',
        'com.shanbay.sentence': 'sentence',
        'com.beeblio.sentence': 'sentence',
    };

    Object.keys(appsData).forEach((key) => {
        if (agent.indexOf(key) !== -1) {
            name = appsData[key];
        }
    });

    return name;
};
