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
 *  fromNow
 *  @param date iso8601
 *  @param now  用于测试
 */
export const fromNow = (time, now) => {
    const ONE_SECOND = 1 * 1000;
    const ONE_MINUTE = ONE_SECOND * 60;
    const ONE_HOUR = ONE_MINUTE * 60;
    const ONE_DAY = ONE_HOUR * 24;
    const stamp = new Date(time);

    if (!now) {
        now = new Date();
    }

    if (stamp > now) {
        return '来自未来';
    }

    const diff = now - stamp;

    if (diff / ONE_DAY >= 1) {
        return `${stamp.getMonth() + 1}月${stamp.getDate()}日`;
    }

    const hours = diff / ONE_HOUR;
    if (hours >= 1) {
        return `${Math.floor(hours)}小时前`;
    }

    const minutes = diff / ONE_MINUTE;
    if (minutes >= 1) {
        return `${Math.floor(minutes)}分钟前`;
    }

    const seconds = diff / ONE_SECOND;
    if (seconds <= 10) {
        return '刚刚';
    }

    return `${Math.floor(seconds)}秒前`;
};
