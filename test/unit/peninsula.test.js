/**
 * Author: petar
 * Date: 7/30/13
 */
'use strict';

//jasmine.getFixtures().fixturesPath = '';

describe('Peninsula Test Suite', function() {

    var app = Peninsula;

    beforeEach(function() {

    });

    afterEach(function() {

    });

    /**
     * Helper functions
     */

    describe('typeOf', function() {
        it('{} is the correct typeOf {}', function() {
            var obj = {};
            expect(app.typeOf(obj)).toEqual('object');
        });

        it('[] is the correct typeOf []', function() {
            var a = [];
            expect(app.typeOf(a)).toEqual('array');
        });
    });

    describe('isEmpty', function() {
        it('should not be an empty array', function() {
            var a = [];
            a.push(1);
            expect(app.isEmpty(a)).not.toBeTruthy();
        });

        it('should not be an empty object', function() {
            var obj = {
                name: 'petar'
            };
            expect(app.isEmpty(obj)).not.toBeTruthy();
        });

        it('should be ab empty array', function() {
            var a = [];
            expect(app.isEmpty(a)).toBeTruthy();
        });

        it('should be an empty object', function() {
            var obj = {};
            expect(app.isEmpty(obj)).toBeTruthy();
        });
    });

    //toBe ===
    //toEqual ==

    //results are empty when search box is empty

    //event handlers are bound

    //building a url based on search term

});

