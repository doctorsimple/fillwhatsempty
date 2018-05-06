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
    'frontpage' : 'This is a demo of CSS animations and basic jQueryUI behaviors. The images are photocollages of console 8-bit video games emulated with Mame.',
    'page__grid_page' : 'This uses a PHP library that accesses the flickr API, a wikipedia scraper that I wrote,  and a js library called Masonry, wrapped up in a Drupal module. The flickr stream used is scans of old books from the British library.',
    'page__tarot_page' : 'This little app uses the Angular JS framework. User information is stored in the DB, user identity is retrieved from a cookie based on the name provided and IP address - not a real identity schema that you would use for anything important. No images, the pictures are all from the standard Unicode emoji set',
    'page__page' : 'See description in right sidebar. It\'s attractively designed.'
};

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
            growing = setInterval(growbubble, 50);
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

Drupal.behaviors.ttc = {
		attach : function(context) {
			jQuery('#addtranslator').on('click', function(e){
				var $t = jQuery('#translators');
				var tname = $t.val();
				var $bookswrapper = jQuery('#bookswrapper');
				$t.find('option[value="'+tname+'"]').remove();
				$bookswrapper.append("<div id='tilethrobber'><i class='glyphicon glyphicon-refresh glyphicon-spin'></i></div>");
				jQuery.post(
						Drupal.settings.basePath+'views/ajax',
						{
							view_name : 'ttc_book',
							view_display_id : 'block',
							view_args : tname
						},
						function(response) {
						    if (response[1] !== undefined) 
						    {
						        var viewHtml = response[1].data;
						        $bookswrapper.find('#tilethrobber').remove();
						        $bookswrapper.append(viewHtml);
						        //adjust widths
						        var bookscount = jQuery('.view-ttc-book').length;
						        $bookswrapper.find('.view-ttc-book').css('max-width', ((99-bookscount)/ bookscount) + '%' )
						        //Adjust row heights
						        .last().find('.views-row').each( function(i){
						        	$this = jQuery(this);
						        	var currheight = $this.outerHeight();
						        	var $samerows = jQuery('.views-row-' + (i+1), context);
						        	$samerows.each( function() {
						        		var $subthis = jQuery(this), myheight =  $subthis.outerHeight()
						        		if (myheight < currheight) {
						        			$subthis.outerHeight(currheight);
						        		} else if (myheight > currheight) {
						        			$this.outerHeight(myheight);
						        			currheight = myheight;
						        		}
						        		
						        	});
						        });

						    }
						}
				)
			});
		}
}