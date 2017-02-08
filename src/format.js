export const parseDate = (time) => {
    const regex = /^(\d{4})\-(\d{2})\-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\+|\-)(\d{4})$/;
    if (regex.test(time)) {
        return new Date([time.slice(0, 22), ':', time.slice(22)].join(''));
    }
    return new Date(time);
};

// TODO: 支持自定义格式
export const formatDate = date => {
    const dateTime = parseDate(date);
    const dateMap = {
        y: dateTime.getFullYear(),
        m: dateTime.getMonth() + 1,
        d: dateTime.getDate(),
    };
    Object.keys(dateMap).forEach(key => {
        if (dateMap[key] < 10) {
            dateMap[key] = `0${dateMap[key]}`;
        }
    });
    return [dateMap.y, dateMap.m, dateMap.d].join('-');
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
