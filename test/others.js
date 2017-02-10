/* eslint max-len: "off" */

const assert = require('chai').assert;
import * as bayUtils from '../src/index';

describe('others', () => {
    describe('getSearchValue', () => {
        it('get url search value by name', () => {
            const value = bayUtils.getSearchValue('status', 'https://news.admin.shanbay.com/admin/articles/?status=2');
            assert.equal(value, '2');
        });
    });

    describe('getCookie', () => {
        it('get cookie by name', () => {
            const cookie = 'locale=zh-cn; userid=23624; csrftoken=HSBe1Zo6zOUTbM30rGZHWwxXsmcT577S; undefined,userid=23624; userid=23624';
            assert.equal(bayUtils.getCookie(cookie, 'csrftoken'), 'HSBe1Zo6zOUTbM30rGZHWwxXsmcT577S');
        });
    });

    describe('getDayDiff', () => {
        it('get diff between days', () => {
            const dataArr = [{
                day1: '2017-2-10 20:20',
                day2: '2017-2-11',
                dayDiff: 1,
            }, {
                day1: '2017-2-11',
                day2: '2017-2-10 02:22',
                dayDiff: -1,
            }, {
                day1: '2017-2-10 20:20',
                day2: '2017-2-12 00:00',
                dayDiff: 2,
            }];
            dataArr.forEach(data => {
                assert.equal(bayUtils.getDayDiff(data.day1, data.day2), data.dayDiff);
            });
        });
    });

    describe('getFrontendVersion', () => {
        const shanbayAgent = 'com.shanbay.words/7.5.900 (Android,4.4.4,MI 3W,Xiaomi; Frontend/1.1)';
        it('get app Frontend Version', () => {
            assert.equal(bayUtils.getFrontendVersion(shanbayAgent), '1.1');
        });
    });
});
