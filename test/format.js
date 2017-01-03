const assert = require('chai').assert;
import * as xbayCommon from '../src/index';

describe('format', () => {
    describe('parseDate', () => {
        let date;
        let dateParsed;
        it('should return proper date', () => {
            date = '2016-08-08T10:15:43+0000';
            dateParsed = '2016-08-08T10:15:43+00:00';
            assert.deepEqual(xbayCommon.parseDate(date), new Date(dateParsed));

            date = '2016-08-09';
            assert.deepEqual(xbayCommon.parseDate(date), new Date(date));

            date = new Date('2016-08-09');
            assert.deepEqual(xbayCommon.parseDate(date), new Date(date));
        });
    });

    describe('formatDate', () => {
        let date;
        let dateFormated;
        it('should return string', () => {
            date = '2016-08-08T10:15:43+0000';
            dateFormated = '2016-08-08';
            assert.equal(xbayCommon.formatDate(date), dateFormated);

            date = '2016-08-09';
            assert.equal(xbayCommon.formatDate(date), date);

            date = new Date('2016-08-09');
            dateFormated = '2016-08-09';
            assert.equal(xbayCommon.formatDate(date), dateFormated);
        });
    });
});
