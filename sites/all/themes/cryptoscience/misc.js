jQuery('document').ready(function() {
    if (Drupal.admin) {
        jQuery('body').css('margin-top', '46px');
    }
    var aboutpagecontent = Drupal.settings.abouttext[Drupal.settings.pagetype];
    jQuery('.logo').popover({
        'animation' : true,
        'content' : aboutpagecontent,
        'placement' : 'bottom',
        'title' : 'About this page',
        'trigger' : 'hover'
    });
    jQuery('.navbar-nav').find('a').each(function(i) {jQuery(this).css('animation-duration', (i*2+1.4) + 's' )});
    jQuery('div.container').on('click','a.singleuse', function(e) {
       jQuery(e.currentTarget).hide();
    });
});

Drupal.settings.abouttext = {
    'frontpage' : 'Mouseover me, the helpful jackalope, to see a little colophon about each page describing how it was built.',
    'page__blobs' : 'This is a demo of CSS animations and basic jQueryUI behaviors. The images are photocollages of console 8-bit video games emulated with Mame.',
    'page__grid_page' : 'This uses a PHP library that accesses the flickr API, a wikipedia scraper that I wrote,  and a js library called Masonry, wrapped up in a Drupal module. The flickr stream used is scans of old books from the British library.',
    'page__tarot_page' : 'This little app uses the Angular JS framework. User information is stored in the DB, user identity is retrieved from a cookie based on the name provided and IP address - not a real identity schema that you would use for anything important. No images, the pictures are all from the standard Unicode emoji set',
    'page__page' : 'See description in right sidebar. It\'s attractively designed.'
};

Drupal.behaviors.frontpage = {
    attach: function(context) {
        $billboards = jQuery('h1.billboard');
        // $billboards.eq(0).hover(
        //     function(e) {
        //         jQuery('body.front').toggleClass('grayscale');
        //     }
        // );
        // $billboards.eq(1).hover(
        //     function(e) {
        //         jQuery('body.front').toggleClass('saturated');
        //     }
        // );
        // $billboards.eq(2).hover(
        //     function(e) {
        //         jQuery('body.front').toggleClass('blurred');
        //     }
        // );
        $billboards.on('click', 'a',  function(e) {
            $target = jQuery(e.target);
            $billboard = $target.parent('.billboard');
            jQuery('body.front').removeClass('grayscale saturated mosaic blurred');
            $billboards.off('mouseenter mouseleave').css('transform','none').find('a');
            $billboard.append('<div class="flipboard-panel"><div class="loading-icon">WAIT</div></div>').find('a').animate({'font-size': 0}, 1000);;
            jQuery.get('/randomflickrpic/'+$billboard.data('keyword'), function(data) {
                $billboard.find('.flipboard-panel').removeClass('loading').find('.loading-icon').replaceWith(data);
            });
        });
    }

}


Drupal.behaviors.videocollage = {
    attach: function (context) {
        var growing;
        var elementcounter = 0;
        jQuery('.frontpagewrapper').on('mousedown', function(e) {
            var $wrapper = jQuery(e.currentTarget);
            var layer = (elementcounter % 6)+1;
           // console.log(e);
           var $thebubble = jQuery('<div></div>', {
               'class' : 'hiddenlayer'+layer+'  hiddenlayer',
               'id' : 'bubble'+elementcounter
           }).height(20).width(20).css({
               'top' : (e.offsetY) + 'px',
               'left' : (e.offsetX) + 'px',
               'transform' : 'translateX(-10px) translateY(-10px)',
               'background-position' : (-1*e.offsetX) + 'px ' + (-1*e.offsetY + 'px'),
               'background-size' : $wrapper.width()+'px auto',
               'z-index' : layer+1
           }).appendTo($wrapper);
            if ($thebubble.hasClass('hiddenlayer2')) {
                $thebubble.css('background-size','25px').addClass('hiddenlayergrow');
            }
            elementcounter += 1;
            function grow() {
                var w = this.width(), h = this.height(), l = this.position().left, t = this.position().top;
                this.width(w+10);
                this.height(h+10);
                this.css({'transform' : 'translateX(' + ((w+10)/-2) + 'px)  translateY(' + ((h+10)/-2) + 'px)',
                'background-position' : (-1*l) + 'px  ' + (-1*t) + 'px' });

            }
            var growbubble = grow.bind($thebubble);
            growing = setInterval(growbubble, 20);
        }).on('mouseup', function(e) {
            clearInterval(growing);
            jQuery('h1.page-header').not(".finished").text('2) Try it again. Or drag your bubble around.');
            setTimeout( function() {
                jQuery('h1.page-header').text("That's pretty much it... Try another page when you get bored.").addClass('finished');
            }, 15000);
            if (e.target.className != 'frontpagewrapper') {
                $target = jQuery(e.target);
                $target.draggable({
                    stack: '.hiddenlayer',
                    start: function (e) {
                        jQuery(e.target).css('transform', 'none');
                    },
                    drag: function (e) {
                        $this = jQuery(e.target);
                        $pos = $this.position();
                        $this.css({'background-position': (-1 * $pos.left) + 'px  ' + (-1 * $pos.top) + 'px'});
                    } ,
                    stop: function (e) {
                        $this = jQuery(e.target);
                        $pos = $this.position();
                        $this.css({'background-position': (-1 * $pos.left) + 'px  ' + (-1 * $pos.top) + 'px'});
                    }
                });

            }
        });

        jQuery('.frontpagewrapper').on('mousedown', '.hiddenlayer',  function(e) { console.log(e);
            e.stopPropagation();
        });

    }
};
