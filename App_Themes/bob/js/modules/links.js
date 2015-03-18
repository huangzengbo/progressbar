"use strict";

App.links = (function () {
    function init() {
        $("body").delegate("a[rel='external']", "click", function () {
            $(this).attr("target","_blank");
        });
    }

    return {
        init: init
    }
})();