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
