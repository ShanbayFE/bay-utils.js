export const getSearchValue = (searchName, url = window.location.href) => {
    const name = searchName.replace(/[\[\]]/g, '\\$&');
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
    const config = $.extend({}, {
        LOGIN_URL: '/accounts/login',
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
        success: json => {
            if (json.status_code === 401 || json.status_code === 403) {
                window.location.href = `${config.LOGIN_URL}/?next=${location.pathname}${location.search}`;
            } else {
                if (json.status_code === 0) {
                    options.success && options.success(json.data);
                } else {
                    options.error && options.error(json.status_code, json.msg || '请求失败，请稍后重试');
                }
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
