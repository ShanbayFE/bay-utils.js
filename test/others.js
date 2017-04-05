/* eslint max-len: "off" */

import { assert } from 'chai';
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

    describe('getUrlsFromString', () => {
        it('can\'t get urls', () => {
            const string = 'content';
            const urls = bayUtils.getUrlsFromStr(string);
            assert.equal(urls, null);
        });
        it('get urls from string', () => {
            const string = 'https://www.google.com/q/qwe/a i like google, I like stackoverflow too. https://stackoverflow.com/qwe?qwe=ee';
            const urls = bayUtils.getUrlsFromStr(string);
            assert.equal(urls[0], 'https://www.google.com/q/qwe/a');
            assert.equal(urls[1], 'https://stackoverflow.com/qwe?qwe=ee');
        });
        it('get same urls from string', () => {
            const string = 'https://www.google.com/q/qwe/a I like google, I like stackoverflow too. https://www.google.com/q/qwe/a';
            const urls = bayUtils.getUrlsFromStr(string);
            assert.equal(urls.length, 2);
        });
    });

    describe('transformUrlToAnchors', () => {
        it('transform urls to anchors', () => {
            const string = 'I like google, https://www.google.com; I like stackoverflow too. https://stackoverflow.com/';
            const newString = bayUtils.transformUrlToAnchor(string);
            assert.equal(newString, 'I like google, <a href=\'https://www.google.com\' target=\'_blank\'>https://www.google.com</a>; I like stackoverflow too. <a href=\'https://stackoverflow.com/\' target=\'_blank\'>https://stackoverflow.com/</a>');
        });
        it('transform same urls to anchors', () => {
            const string = 'https://www.google.com i like google, https://www.google.com, I like stackoverflow too. https://stackoverflow.com/';
            const newString = bayUtils.transformUrlToAnchor(string);
            assert.equal(newString, '<a href=\'https://www.google.com\' target=\'_blank\'>https://www.google.com</a> i like google, <a href=\'https://www.google.com\' target=\'_blank\'>https://www.google.com</a>, I like stackoverflow too. <a href=\'https://stackoverflow.com/\' target=\'_blank\'>https://stackoverflow.com/</a>');
        });
    });

    describe('uniqArr', () => {
        it('null convert to an empty array', () => {
            const arr = null;
            const newArr = bayUtils.uniqArr(arr);
            assert.equal(newArr.length, 0);
        });
        it('collapse array of numbers', () => {
            const arr = [1, 1, 2, 3, 4, 4];
            const newArr = bayUtils.uniqArr(arr);
            assert.equal(newArr.length, 4);
        });
        it('collapse array of string', () => {
            const arr = ['1', '1', '2'];
            const newArr = bayUtils.uniqArr(arr);
            assert.equal(newArr.length, 2);
        });
        it('collapse array of object', () => {
            const arr = [{ a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1 }];
            const newArr = bayUtils.uniqArr(arr);
            assert.equal(newArr.length, 3);
        });
        it('collapse array of any', () => {
            const arr = [1, '1', { a: 1 }, '1'];
            const newArr = bayUtils.uniqArr(arr);
            assert.equal(newArr.length, 3);
        });
    });
});
