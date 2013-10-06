/**
 * Author: petar
 * Date: 7/30/13
 */
'use strict';

//jasmine.getFixtures().fixturesPath = '';

describe('Peninsula Test Suite', function () {

    var pen = Peninsula;

    beforeEach(function () {

    });

    afterEach(function () {

    });

    /**
     * Helper functions
     */

    describe('typeOf', function () {
        //Array
        it('should return type of "array"', function () {
            var a = [];
            expect(pen.typeOf(a)).toEqual('array');
        });

        //number
        it('should return typeof "number"', function () {
            var num = 5;
            expect(pen.typeOf(num)).toEqual('number');
        });

        //string
        it('should return typeof "string"', function () {
            var word = 'hello';
            expect(pen.typeOf(word)).toEqual('string');
        });

        //null
        it('should return typeof "null"', function () {
            var word = null;
            expect(pen.typeOf(word)).toEqual('null');
        });

        //undefined
        it('should return typeof "undefined"', function () {
            var word;
            expect(pen.typeOf(word)).toEqual('undefined');
        });

        /* object - TODO
        it('should return typeof "object"', function () {
            var word = {};
            expect(pen.typeOf(word)).toEqual('[object Object]');
        });
        /* */
    });

    describe('isEmpty', function () {

        it('should return false, not an empty array', function () {
            var a = [];
            a.push(1);
            expect(pen.isEmpty(a)).not.toBeTruthy();
        });

        it('should not return false, not an empty object', function () {
            var obj = {
                name: 'petar'
            };
            expect(pen.isEmpty(obj)).not.toBeTruthy();
        });

        it('should return false, not an object', function () {
            var obj = 5;
            expect(pen.isEmpty(obj)).not.toBeTruthy();
        });

        it('should return true, an empty array', function () {
            var a = [];
            expect(pen.isEmpty(a)).toBeTruthy();
        });

        it('should return true, an empty variable', function () {
            var a;
            expect(pen.isEmpty(a)).toBeTruthy();
        });

        /* Empty Object - TODO
        it('should return true, an empty object', function () {
            var a = {};
            expect(pen.isEmpty(a)).toBeTruthy();
        }); */
    });

    describe('isInteger', function () {

        it('should return false, array is not an integer', function () {
            var a = [];
            expect(pen.isInteger(a)).not.toBeTruthy();
        });

        it('should return false, object is not an integer', function () {
            var obj = {
                age: 5
            };
            expect(pen.isInteger(obj)).not.toBeTruthy();
        });

        it('should return false, string is not an integer', function () {
            var string = 'hello world';
            expect(pen.isInteger(string)).not.toBeTruthy();
        });

        it('should return false, float is not an integer', function () {
            var floating = 1.1234567;
            expect(pen.isInteger(floating)).not.toBeTruthy();
        });

        it('should return false, double is not an integer', function () {
            var double = 1.1;
            expect(pen.isInteger(double)).not.toBeTruthy();
        });

        it('should return false, undefined is not an integer', function () {
            var n = undefined;
            expect(pen.isInteger(n)).not.toBeTruthy();
        });

        it('should return false, null is not an integer', function () {
            var n = null;
            expect(pen.isInteger(n)).not.toBeTruthy();
        });

        it('should return true, time in milliseconds is an integer', function () {
            var time = new Date().getTime();
            expect(pen.isInteger(time)).toBeTruthy();
        });

        it('should return true, number is an integer', function () {
            var n = 5;
            expect(pen.isInteger(n)).toBeTruthy();
        });

    });

    describe('contains', function () {

        it('should return true', function () {
            var word = 'hello world',
                substring = 'hello';
            expect(pen.contains(word, substring)).toBeTruthy();
        });

        it('should return true', function () {
            var word = 'hello world',
                substring = 'o w';
            expect(pen.contains(word, substring)).toBeTruthy();
        });

        it('should return false', function () {
            var word = 'hello world',
                substring = 'He'; //not cap sensitive
            expect(pen.contains(word, substring)).not.toBeTruthy();
        });

        it('should return false', function () {
            var word = 'hello world',
                substring = 'cat';
            expect(pen.contains(word, substring)).not.toBeTruthy();
        });

        it('should return false', function () {
            var word = 'ca',
                substring = 'cat';
            expect(pen.contains(word, substring)).not.toBeTruthy();
        });
    });

    describe('isUrl', function () {

        it('should return true', function () {
            var word = 'http://cats.com';
            expect(pen.isUrl(word)).toBeTruthy();
        });

        it('should return true', function () {
            var word = 'https://cats.com';
            expect(pen.isUrl(word)).toBeTruthy();
        });

        it('should return false', function () {
            var object = {}; //to throw exception or not?
            expect(pen.isUrl(object)).not.toBeTruthy();
        });

        it('should return false', function () {
            var array = []; //to throw exception or not?
            expect(pen.isUrl(array)).not.toBeTruthy();
        });

        it('should return false', function () {
            var urlFunction = function() {
                var hiddenUrl = 'http://cats.com';
            };
            var stringData = urlFunction.toString();
            expect(pen.isUrl(stringData)).not.toBeTruthy();
        });

        it('should return false', function () {
            var word = 'https//cats.com'; //typo missing colon :
            expect(pen.isUrl(word)).not.toBeTruthy();
        });

        it('should return false', function () {
            var word = 'https:/cats.com'; //type missing one forward slash
            expect(pen.isUrl(word)).not.toBeTruthy();
        });

    });
});

//toBe ===
//toEqual ==

