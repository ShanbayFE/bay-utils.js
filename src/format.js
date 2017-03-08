export const parseDate = (time) => {
    const regex = /^(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\+|\-)(\d{4})$/;
    if (regex.test(time)) {
        return new Date([time.slice(0, 22), ':', time.slice(22)].join(''));
    }
    return new Date(time);
};

export const pad = (n, length, symbol) =>
    (n.length >= length ? n : new Array(length - n.length + 1).join(symbol) + n);

export const formatDate = (date, format = 'yyyy-MM-DD') => {
    const weekdays = '日_一_二_三_四_五_六'.split('_');
    const newDate = parseDate(date);
    const dateMap = {
        y: newDate.getFullYear(),
        M: newDate.getMonth() + 1,
        D: newDate.getDate(),
        d: newDate.getDay(),
        h: newDate.getHours(),
        m: newDate.getMinutes(),
        s: newDate.getSeconds(),
        S: newDate.getMilliseconds(),
    };
    const dateStr = format.replace(/([yMDdhmsS])+/g, (match, key) => {
        let dateItem = dateMap[key];
        const matchLen = match.length;

        if (dateItem === undefined) {
            return match;
        }

        dateItem = dateItem.toString();

        if (match === 'd') {
            return weekdays[dateItem];
        }

        // 当长度不够时，用 0 填充
        if (matchLen > dateItem.length) {
            return pad(dateItem, matchLen, 0);
        }

        // 只有 year 可以截取，其他都无法截取
        if (key === 'y') {
            return dateItem.substr(dateItem.length - matchLen);
        }

        return dateItem;
    });
    return dateStr;
};

export const trimString = (text, limit, symbol = '...') => {
    if (text.length <= limit) {
        return text;
    }
    return text.slice(0, limit) + symbol;
};

export const formatSafetyStr = (str, start, end, symbol = '*') => {
    str = str.toString();
    const symbolLen = str.length - start - end;
    if (symbolLen < 0) {
        return str;
    }
    const symbolStr = new Array(symbolLen + 1).join(symbol);
    return [str.slice(0, start), symbolStr, end <= 0 ? '' : str.slice(-end)].join('');
};

export const formatSafetyEmail = (email, start, end, symbol) => {
    const str = email.toString();
    start = Number(start) || Math.floor(str.length * 1 / 4);
    end = Number(end) || Math.floor(str.length * 1 / 4);
    return formatSafetyStr(str, start, end, symbol);
};

export const formatSafetyMobilephone = (mobilephone, start = 3, end = 4, symbol) =>
    formatSafetyStr(mobilephone, start, end, symbol);

/**
 * @param {string} time iso foramt string
 * @param {object} config
 */
export const fromNow = (time, config = {}) => {
    const updateTime = parseDate(time).getTime();
    const currentTime = new Date().getTime();

    const delayTime = (() => {
        if (config.boundTime) {
            return parseDate(config.boundTime).getTime();
        }
        if (config.intervalTime) {
            const ONE_DAY = 24 * 60 * 60 * 1000;
            return config.intervalTime * ONE_DAY;
        }
        return new Date().getTime();
    })();

    if ((currentTime - updateTime) >= (currentTime - delayTime)) {
        return formatDate(updateTime, 'MM月DD日');
    }

    const ms = Math.floor((currentTime - updateTime) / 1000);

    if (ms === 0) {
        return '1秒';
    }

    const d = Math.floor(ms / (60 * 60 * 24));
    const h = Math.floor(ms / (60 * 60)) - (d * 24);
    const m = Math.floor(ms / 60) - (d * 24 * 60) - (h * 60);
    const s = ms % 60;
    const days = d ? `${d}天` : '';
    const hours = h ? `${h}小时` : '';
    const mins = m ? `${m}分钟` : '';
    const secs = s ? `${s}秒` : '';

    return `${days}${hours}${mins}${secs} 前`;
};
