Drupal.behaviors.versionComparator = {
    attach : function(context) {
        jQuery('#addtranslator').on('click', addTranslator);
        jQuery('.translator-select').on('click', addTranslator)
    }


}

function addTranslator(e){
  //  var $t = jQuery('#translators');
    var tname = e.target.value;
    var $bookswrapper = jQuery('#bookswrapper');
    $bookswrapper.append("<div id='tilethrobber'><i class='glyphicon glyphicon-refresh glyphicon-spin'></i></div>");
    var $removedbutton = jQuery(e.target).detach();
    jQuery.post(
        Drupal.settings.basePath+'views/ajax',
        {
            view_name : 'version_comparator_book',
            view_display_id : 'block',
            view_args : tname
        },
        function(response) {
            if (response[1] !== undefined)
            {
                var viewHtml = response[1].data;
                $bookswrapper.find('#tilethrobber').remove();
                $bookswrapper.append(viewHtml);
                jQuery('.vc-book-header').width('auto');
                jQuery('#bookswrapper .view-header').width('auto');
                var bookscount = jQuery('.view-version-comparator-book').length;
                $bookswrapper.find('.view-version-comparator-book')
                //Adjust row heights
                    .last().find('.views-row').each( function(i){
                    if ( bookscount == 1) {
                        return false;
                    }
                    var $samerows = jQuery('.views-row-' + (i+1));
                    jQuery($samerows).matchHeight();
                });
                //Set headers
                jQuery('.vc-book-header').each( function(i) {
                    var setwidth = jQuery(this).parents('.view-header').width();
                    jQuery(this).width( setwidth);
                    jQuery(this).parents('.view-header').width(setwidth);
                })
                jQuery('#bookswrapper .vc-book-header')
                    .affix({
                            offset: {
                                top: jQuery('#bookswrapper').offset().top, target: '.view-header'
                            }
                        }
                    );
            } else {
                //failure to retrieve
                $removedbutton.prepend('Error: Could not find ').appendTo('#selectbuttonswrapper');
            }
        }
    )
}