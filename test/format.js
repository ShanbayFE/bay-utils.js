const assert = require('chai').assert;
import * as bayUtils from '../src/index';

const test = (func, dataArr) => {
    it('should return correct result', () => {
        dataArr.forEach((data, index) => {
            const { params, result } = data;
            assert.equal(bayUtils[func](params[0], params[1], params[2]), result, `error: ${index}`);
        });
    });
};

describe('format', () => {
    describe('parseDate', () => {
        let date;
        let dateParsed;
        it('should return proper date', () => {
            date = '2016-08-08T10:15:43+0000';
            dateParsed = '2016-08-08T10:15:43+00:00';
            assert.deepEqual(bayUtils.parseDate(date), new Date(dateParsed));

            date = '2016-08-09';
            assert.deepEqual(bayUtils.parseDate(date), new Date(date));

            date = new Date('2016-08-09');
            assert.deepEqual(bayUtils.parseDate(date), new Date(date));
        });
    });

    describe('formatDate', () => {
        const dataArr = [{
            params: ['2016-08-08T10:15:43+0000'],
            result: '2016-08-08',
        }, {
            params: ['2016-08-09', 'yy年MM月DD日'],
            result: '16年08月09日',
        }, {
            params: ['2016-08-09', 'yy年M月D日'],
            result: '16年8月9日',
        }, {
            params: ['2016-11-19', 'yy年M月D日'],
            result: '16年11月19日',
        }, {
            params: ['2016-08-09 08:01:23', 'yy.M.D hh:m ss秒 SSS毫秒'],
            result: '16.8.9 08:1 23秒 000毫秒',
        }, {
            params: [new Date('2016-08-09 13:44:23'), 'yy.w.DD'],
            result: '16.w.09',
        }, {
            params: ['2017-02-19T10:15:43+0000', 'd'], // 周日
            result: '日',
        }, {
            params: ['2016-08-09', 'YY年MM月DD日'],
            result: '16年08月09日',
        }, {
            params: ['2016-08-09', 'YYYY年M月D日'],
            result: '2016年8月9日',
        }];
        test('formatDate', dataArr);
    });

    describe('trimString', () => {
        const dataArr = [{
            params: ['China will fingerprint foreigners', 3],
            result: 'Chi...',
        }, {
            params: ['China will fingerprint foreigners', 3, '***'],
            result: 'Chi***',
        }];
        test('trimString', dataArr);
    });

    describe('formatSafetyStr', () => {
        it('should return replaced string by symbol', () => {
            assert.equal(bayUtils.formatSafetyStr('123454321', 1, 3), '1*****321');
            assert.equal(bayUtils.formatSafetyStr('123454321', 2, 3, '-'), '12----321');
            assert.equal(bayUtils.formatSafetyStr('123454321', 7, 6, '-'), '123454321');
        });
    });

    describe('formatSafetyEmail', () => {
        it('should return replaced email by symbol', () => {
            assert.equal(bayUtils.formatSafetyEmail('1234567@qq.com'), '123********com');
            assert.equal(bayUtils.formatSafetyEmail('123@163.com', undefined, 4), '12*****.com');
            assert.equal(bayUtils.formatSafetyEmail('1231231231@qq.com', 2, 5), '12**********q.com');
        });
    });

    describe('formatSafetyMobilephone', () => {
        it('should return replaced email by symbol', () => {
            assert.equal(bayUtils.formatSafetyMobilephone('18111223344'), '181****3344');
            assert.equal(bayUtils.formatSafetyMobilephone('18111223344', 2), '18*****3344');
        });
    });

    describe('formatNumToCn', () => {
        it('should return chinese number', () => {
            assert.equal(bayUtils.formatNumToCn(0), '零');
            assert.equal(bayUtils.formatNumToCn(3), '三');
            assert.equal(bayUtils.formatNumToCn(10), '十');
            assert.equal(bayUtils.formatNumToCn(15), '十五');
            assert.equal(bayUtils.formatNumToCn(40), '四十');
            assert.equal(bayUtils.formatNumToCn(45), '四十五');
            assert.equal(bayUtils.formatNumToCn(99), '九十九');
        });
    });
});
