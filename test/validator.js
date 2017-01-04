/* eslint max-len: "off" */

const assert = require('chai').assert;
import * as xbayCommon from '../src/index';

const test = (options) => {
    const args = options.args || [];
    args.unshift(null);
    it(`should validate ${options.name}`, () => {
        if (options.valid) {
            options.valid.forEach((valid) => {
                args[0] = valid;
                const warning = `xbayCommon.${options.validator}(${valid}, ${args.join(',')}) failed but should have passed`;
                assert.equal(xbayCommon[options.validator](...args), true, warning);
            });
        }
        if (options.invalid) {
            options.invalid.forEach((invalid) => {
                args[0] = invalid;
                const warning = `xbayCommon.${options.validator}(${invalid}, ${args.join(',')}) passed but should have failed`;
                assert.equal(xbayCommon[options.validator](...args), false, warning);
            });
        }
    });
};

describe('validator', () => {
    describe('assertString', () => {
        it('should throw error if it isn\'t string', () => {
            assert.isUndefined(xbayCommon.assertString('123'));
            assert.throws(xbayCommon.assertString);
        });
    });

    describe('toString', () => {
        it('should return string', () => {
            assert.equal(xbayCommon.toString('miaomiao'), 'miaomiao'); // 字符串
            assert.equal(xbayCommon.toString(123), '123'); // 数字
            assert.equal(xbayCommon.toString([1, 'miao', 3, 'ice']), '1,miao,3,ice'); // 数组
            assert.equal(xbayCommon.toString({ x: 1, y: 'ice' }), '[object Object]'); // 对象
            assert.equal(
                xbayCommon.toString(new Date('2016-08')),
                'Mon Aug 01 2016 08:00:00 GMT+0800 (CST)'
            ); // 日期
            assert.equal(xbayCommon.toString(() => {}), ''); // 函数
            assert.equal(xbayCommon.toString(undefined), ''); // undefined
        });
    });

    describe('merge', () => {
        it('should return a merged object', () => {
            const a = {
                x: 2,
                y: 'miao',
                month: 12,
            };
            const b = {
                x: 4,
                year: 2017,
            };
            const c = {
                x: 2,
                y: 'miao',
                month: 12,
                year: 2017,
            };
            assert.deepEqual(xbayCommon.merge(a, b), c);
        });
    });

    describe('isStandardBrowserEnv', () => {
        assert.equal(xbayCommon.isStandardBrowserEnv(), false);
    });

    describe('isFunction', () => {
        test({
            validator: 'isFunction',
            valid: [() => {}, (a) => { a = a + 1; return a; }],
            invalid: [
                { x: 1, y: 2 },
                [1, 2, 3],
                'i am string',
            ],
        });
    });

    const pcAgent = 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95';
    const mobileAgent = 'AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143';
    const shanbayAgent = 'com.shanbay.words/7.5.900 (Android,4.4.4,MI 3W,Xiaomi; Frontend/1.1)';
    const wechatAgent = 'micromessenger/3.2.1(Android,4.4.4,MI 3W,Xiaomi; Frontend/1.1) Chrome/55.0.2883.95';

    describe('isWechatUA', () => {
        test({
            validator: 'isWechatUA',
            valid: [wechatAgent],
            invalid: [pcAgent, mobileAgent, shanbayAgent],
        });
    });

    describe('isMobileUA', () => {
        test({
            validator: 'isMobileUA',
            valid: [shanbayAgent, mobileAgent, wechatAgent],
            invalid: [pcAgent],
        });
    });

    describe('isShanbayAppUA', () => {
        test({
            validator: 'isShanbayAppUA',
            valid: [shanbayAgent],
            invalid: [pcAgent, mobileAgent, wechatAgent],
        });
    });

    describe('isMobilePhone', () => {
        test({
            validator: 'isMobilePhone',
            valid: [13881123401, '13881123401'],
            invalid: ['1388112301', '1388111123401', '13881123401s'],
        });
    });

    describe('isEmail', () => {
        test({
            validator: 'isEmail',
            valid: [
                'foo@bar.com.au',
                'Namesome.name.midd.leNa.me.extension@GoogleMail.com',
                '"foobar"@example.com',
            ],
            invalid: [
                'invalidemail@',
                'invalid.com',
                '@invalid.com',
                'foo@bar.com.',
                'foo@bar.co.uk.',
                'Name foo@bar.co.uk',
            ],
        });
    });

    describe('isUrl', () => {
        test({
            validator: 'isUrl',
            valid: [
                'shanbay.com',
                'www.shanbay.com',
                'http://www.foobar.com/',
                'http://www.foobar.com:23/',
                'http://www.foobar.com:65535/',
                'http://www.foobar.com:5/',
                'https://www.foobar.com/',
                'http://foo--bar.com',
                'http://foobar.com/?foo=bar',
            ],
            invalid: [
                'xyz://foobar.com',
                'invalid.x',
                'invalid.',
                '.com',
            ],
        });
    });

    describe('escapeStr', () => {
        it('should transfor some symbol to string', () => {
            assert.equal(xbayCommon.escapeStr('<p>miao miao</p>'), '&lt;p&gt;miao miao&lt;&#x2F;p&gt;');
        });
    });

    describe('unescapeStr', () => {
        it('should transfor some symbol to string', () => {
            assert.equal(xbayCommon.unescapeStr('&lt;p&gt;miao miao&lt;&#x2F;p&gt;'), '<p>miao miao</p>');
        });
    });

    describe('isStrLength', () => {
        test({
            validator: 'isStrLength',
            valid: [
                'miaomiaomiao',
                'iamstring',
                '我是字符串i am',
                'lalalalalaaaaaaaa==',
                'la',
            ],
            invalid: [
                '',
                'lalalalalaaaaaaaa==lalalalalaaaaaaaa==lalalalalaaaaaaaa==',
            ],
            args: [{
                max: 30,
                min: 2,
            }],
        });
    });

    describe('isJSON', () => {
        test({
            validator: 'isJSON',
            valid: [
                '{"x": 1, "y": "miao"}',
                '{}',
            ],
            invalid: [
                '{ key: "value" }',
                '{ \'key\': \'value\' }',
                'null',
                '1234',
                'false',
                '"nope"',
            ],
        });
    });

    describe('isNumeric', () => {
        test({
            validator: 'isNumeric',
            valid: [
                '123',
                '00123',
                '-00123',
                '0',
                '-0',
                '+123',
            ],
            invalid: [
                '123.123',
                ' ',
                '.',
            ],
        });
    });

    describe('isEmptyStr', () => {
        test({
            validator: 'isEmptyStr',
            valid: [
                '',
            ],
            invalid: [
                'miao',
                ' ',
                '3',
            ],
        });
    });
});
