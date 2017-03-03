export const parseDate = (time) => {
    // example: '2017-03-02T23:49:45+0800';
    const regex = /^(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\+|\-)(\d{4})$/;
    // example: '2017-03-02T23:49:45';
    const regex1 = /^(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

    if (regex.test(time)) {
        return new Date([time.slice(0, 22), ':', time.slice(22)].join(''));
    } else if (regex1.test(time)) {
        return new Date(time.replace('T', ' '));
    }
    return new Date(time);
};

export const pad = (n, length, symbol) =>
    (n.length >= length ? n : new Array(length - n.length + 1).join(symbol) + n);

export const formatDate = (date, format = 'yyyy-MM-dd') => {
    const newDate = parseDate(date);
    const dateMap = {
        y: newDate.getFullYear(),
        M: newDate.getMonth() + 1,
        d: newDate.getDate(),
        h: newDate.getHours(),
        m: newDate.getMinutes(),
        s: newDate.getSeconds(),
        S: newDate.getMilliseconds(),
    };
    const dateStr = format.replace(/([yMdhmsS])+/g, (match, key) => {
        let dateItem = dateMap[key];
        const matchLen = match.length;

        if (dateItem === undefined) {
            return match;
        }

        dateItem = dateItem.toString();

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
