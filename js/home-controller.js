const verbose = false;
var verb = function(obj) {
    if (verbose) console.log(obj);
}
var rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//check if an element is in the viewport
function isElementInViewport(elem) {
    var narrowing = 100;
    var $elem = $(elem);
    verb($elem);
    // Get the scroll position of the page.
    //var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
    var viewportTop = window.pageYOffset + narrowing;
    var viewportBottom = viewportTop + $(window).height() - 2 * narrowing;

    // Get the position of the element on the page.
    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();
    //verb("viewportTop: " + viewportTop + "viewportBottom: " + viewportBottom + "elemTop: " + elemTop + "elemBottom: " + elemBottom);
    return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
}

// If an element is in view, add the start class to it.
function checkAnimation() {
    var $elem = $('h1');
    $elem.each(function() {
        if ($(this).hasClass('slide')) return;
        if (isElementInViewport($(this))) {
            $(this).addClass('slide');
        }
    });
}

function openMenu() {
    $("ul.dl-nav").css("transform", "translateX(0)");
}

function closeMenu() {
    $("ul.dl-nav").css("transform", '');
}

$(document).ready(
    function() {
        //handle the menu button being clicked or touched
        $("#menu").on("touchend", function() {
            openMenu();
        });
        $("#menu").on("click", function() {
            openMenu();
        });
        //close menu when body is clicked or touched
        $("body").on("touchend", function(event) {
            if(event.target.localName != 'a'){//if you don't exclude anchor elements, the links won't work on some android devices
                closeMenu();
            }
        });
        $("body").on("click", function(event) {
            if(event.target.localName != 'a'){
                closeMenu();
            }
        });

        //----------CODE TO RUN ANIMATIONS ONLY WHEN THEY COME INTO VIEW----------
        $(window).scroll(function() {
            checkAnimation();
        });
        //----------CODE TO RETRIEVE AND INSERT CONTENT FROM JSON RANDOMLY----------
        var json = null;
        $.ajax({
            'global': false,
            'url': 'js/home-content.json',
            'dataType': "json",
            'success': function(data) {
                data;
                $("#home-title").html(data.homeTitle[rand(0, data.homeTitle.length - 1)]);
                $("#home-content-1").html(data.homeContent1[rand(0, data.homeContent1.length - 1)]);
                $("#home-currently").html(data.homeCurrently)
            }
        });
        //check animations once on pageload in case they need to swoop in before the first scroll action
        checkAnimation();
    }
)