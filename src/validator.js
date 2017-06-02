/* eslint max-len: "off" */
// Ref: https://github.com/chriso/validator.js

export const assertString = (input) => {
    if (typeof input !== 'string') {
        throw new TypeError('This library (validator.js) validates strings only');
    }
};

export const toString = (input) => {
    if (typeof input === 'object' && input !== null) {
        if (typeof input.toString === 'function') {
            input = input.toString();
        } else {
            input = '[object Object]';
        }
    } else if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
        input = '';
    }
    return String(input);
};

export const merge = (obj = {}, defaults) => {
    Object.keys(defaults).forEach(key => {
        if (typeof obj[key] === 'undefined') {
            obj[key] = defaults[key];
        }
    });
    return obj;
};

export const isStandardBrowserEnv = () =>
    (typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function')
;

export const isFunction = val => Object.prototype.toString.call(val) === '[object Function]';

export const isWechatUA = (agent) =>
    /micromessenger/i.test(agent);

export const isMobileUA = (agent) =>
    /Mobile|iP(hone|od|ad)|iOS|Android|BlackBerry/i.test(agent);

export const isAndroidUA = (agent) =>
    /(android)/i.test(agent);

export const isIOSUA = (agent) =>
    /iPad|iOS|iPhone|iPod/i.test(agent);

export const isShanbayAppUA = (agent) =>
    /com\.shanbay|com\.beeblio/.test(agent.toLowerCase());

export const isMobilePhone = (data) => {
    const str = toString(data);
    const phones = {
        'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
        'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
    };

    return phones['zh-CN'].test(str) || phones['zh-TW'].test(str);
};

export const isEmail = (data) => {
    assertString(data);
    const re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(data);
};

export const isUrl = (url) => {
    assertString(url);
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(url);
};

export const escapeStr = (str) => {
    assertString(str);
    return (str.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;')
        .replace(/\\/g, '&#x5C;')
        .replace(/`/g, '&#96;'));
};

export const unescapeStr = (str) => {
    assertString(str);
    return (str.replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x2F;/g, '/')
        .replace(/&#96;/g, '`'));
};

export const isStrLength = (str, options) => {
    assertString(str);
    let min;
    let max;
    if (typeof(options) === 'object') {
        min = options.min || 0;
        max = options.max;
    } else { // backwards compatibility: isStrLength(str, min [, max])
        min = arguments[1];
        max = arguments[2];
    }
    const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
    const len = str.length - surrogatePairs.length;
    return len >= min && (typeof max === 'undefined' || len <= max);
};

export const isJSON = (str) => {
    assertString(str);
    try {
        const obj = JSON.parse(str);
        return !!obj && typeof obj === 'object';
    } catch (e) { /* ignore */ }
    return false;
};

export const isNumeric = (str) => {
    const numeric = /^[-+]?[0-9]+$/;
    assertString(str);
    return numeric.test(str);
};

export const isEmptyStr = (str) => {
    assertString(str);
    return str.length === 0;
};

export const isEmptyObj = (obj) => !Object.keys(obj).length;

export const isArray = (obj) =>
  Object.prototype.toString.call(obj) === '[object Array]';
