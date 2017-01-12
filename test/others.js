
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
});
