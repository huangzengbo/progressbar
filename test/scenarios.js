'use strict';

describe('Bob\'s progress bar test', function () {
    beforeEach(function () {
        browser().navigateTo('../index.html');
    });

    it('0% test', function () {
        element('.js-bar-control-button:first').query(function ($el, done) {
            $el.click();
            done();
        });
        expect(element('.js-progress-bar i:first').text()).toMatch("0");
    });

    it('50% test', function () {
        element('.js-bar-control-button:last').query(function ($el, done) {
            $el.click();
            done();
        });
        expect(element('.js-progress-bar i:first').text()).toMatch("50");
    });

    it('100% test', function () {
        element('.js-bar-control-button:last').query(function ($el, done) {
            $el.click();
            $el.click();
            $el.click();
            done();
        });
        expect(element('.js-progress-bar i:first').text()).toMatch("100");
    });
});
