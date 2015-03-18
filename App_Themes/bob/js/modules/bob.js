"use strict";

App.bob = (function () {
    function init() {
        initStatus();
        initEvents();
    }

    function initStatus() {
        $(".js-progress-bar").find("li:first").addClass("selected");
        $(".js-progress-bar li").each(function (index) {
            var percentage = $(this).find("span i").text();
            $(this).find("div").css({ "width": (100 - percentage) + "%" });
        });
    }

    function initEvents() {
        $("body").delegate(".js-bar-control-button", "click", function (e) {
            e.preventDefault();
            var $selectedBar = $(".js-progress-bar").find("li.selected");
            var result = parseFloat($selectedBar.find("i").text()) + parseFloat($(this).data("changenumber"));
            if (result <= 0) {
                $selectedBar.find("div").css({ "width": "100%" });
                $selectedBar.find("i").text("0");
            }
            else if (result > 100) {
                $selectedBar.find("div").css({ "width": "0%" });
                $selectedBar.find("i").text(result);
                $selectedBar.addClass("overload");
            }
            else {
                $selectedBar.find("div").css({ "width": (100 - result) + "%" });
                $selectedBar.find("i").text(result);
                $selectedBar.removeClass("overload");
            }
        });
    }

    function changeBar() {
        var barNumber = $("#choose-bar").val();
        $(".js-progress-bar").find("li").removeClass("selected");
        $(".js-progress-bar").find("li:nth-child(" + barNumber + ")").addClass("selected");
    }

    return {
        init: init,
        changeBar: changeBar
    }
})();