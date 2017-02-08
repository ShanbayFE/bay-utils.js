const assert = require('chai').assert;
import * as bayUtils from '../src/index';

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
        let date;
        let dateFormated;
        it('should return string', () => {
            date = '2016-08-08T10:15:43+0000';
            dateFormated = '2016-08-08';
            assert.equal(bayUtils.formatDate(date), dateFormated);

            date = '2016-08-09';
            assert.equal(bayUtils.formatDate(date), date);

            date = new Date('2016-08-09');
            dateFormated = '2016-08-09';
            assert.equal(bayUtils.formatDate(date), dateFormated);
        });
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
});
