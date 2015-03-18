"use strict";

App.form = (function () {

    function init() {
        dropDown();
    }

    function dropDown() {
        $('.form-field select').dropkick().change(function () {
            App.bob.changeBar();
        });
    }

    return {
        init: init
    }
})();