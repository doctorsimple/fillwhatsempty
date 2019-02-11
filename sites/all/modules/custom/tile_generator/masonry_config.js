Drupal.behaviors.tileGenerator = {
    attach: function (context) {
        if (Drupal.settings.Masonry && Drupal.settings.Masonry.active) {
            jQuery('.node-grid-page').prepend('<div class="grid"></div>');
            Drupal.settings.Masonry.processnext = true; //set to false when load fails
            var activeRequest = {};
            var $tilethrobber = jQuery("<div id='tilethrobber' class='grid-item'><i class='glyphicon glyphicon-refresh glyphicon-spin'></i></div>");
            var counter = (function() {
                var privateCounter = 0;
                function changeBy(val) {
                    privateCounter += val;
                }
                return {
                    inc: function() {
                        changeBy(1);
                    },
                    dec: function() {
                        changeBy(-1);
                    },
                    val: function() {
                        return privateCounter;
                    },
                    reset: function() {
                        privateCounter = 0;
                    }
                };
            })();
            jQuery('#form-tile-generator-form input').on('focus', function(e) {
                activeRequest.abort();
                $tilethrobber.remove();
                jQuery('#theend').remove();
                Drupal.settings.Masonry.processnext = false;
            });
            jQuery('#form-tile-generator-form').on('submit', function(e) {
                e.preventDefault();
                Drupal.settings.Masonry.nextpage = null;
                Drupal.settings.Masonry.searchterm = jQuery(e.target).find('.form-text').val();
                counter.reset();
                jQuery('#theend').remove();
                jQuery('.grid').remove();
                jQuery('.node-grid-page').prepend('<div class="grid"></div>');
                Drupal.settings.Masonry.processnext = true; //set to false when load fails
                getNextTile();
            });

            function getNextTile() {
                if (Drupal.settings.Masonry.processnext) {
                    var $grid = jQuery('.grid');
                    $grid.after($tilethrobber);
                    if (typeof(Drupal.settings.Masonry.nextpage) === 'undefined' || Drupal.settings.Masonry.nextpage === null) {
                        activeRequest = jQuery.get('tilegenerator-fetch/' + Drupal.settings.Masonry.searchterm + '/true', function (data) {
                            $tilethrobber.remove();
                            if (data == '') {
                                $grid.append('<h2 style="font-family: rancho, serif">Nothing found for that search. Try again.</h2>');
                                $tilethrobber.remove();
                                return false;
                            }
                            $grid.masonry({
                                columnWidth: 380,
                                itemSelector: '.grid-item'
                                // gutter : 2
                            });
                            $newelement = jQuery(data);
                            $grid.append($newelement).masonry('appended', $newelement);
                            $newelement.each(function(i) {
                                var h = $grid.height();
                                if (this.className == 'grid-item') {
                                    if (this.offsetHeight+this.offsetTop > h ) {
                                        $grid.height(h = this.offsetHeight+this.offsetTop);
                                    }
                                }
                            });
                            $grid.after($tilethrobber);
                            $grid.masonry('layout');

                            counter.inc();
                            if (counter.val() == 12) {
                                Drupal.settings.Masonry.Drupal.settings.Masonry.processnext = false;
                                jQuery('#tilethrobber').remove();
                            }
                            getNextTile();
                        });
                    } else {
                        activeRequest = jQuery.get('tilegenerator-fetch/' + Drupal.settings.Masonry.searchterm + '/false/' + (counter.val()+1), function (data) {
                            $tilethrobber.remove();
                            if (data == '') {
                                $grid.after('<h2 id="theend" style="font-family: rancho, serif">The End</h2>');
                                return false;
                            }
                            $newelement = jQuery(data);
                            $grid.append($newelement).masonry('appended', $newelement);
                            $newelement.each(function(i) {
                                var h = $grid.height();
                                if (this.className == 'grid-item') {
                                    if (this.offsetHeight+this.offsetTop > h ) {
                                        $grid.height(h = this.offsetHeight+this.offsetTop);
                                    }
                                }
                            });
                            $grid.after($tilethrobber);
                            $grid.masonry('layout');

                            counter.inc();
                            if (counter.val() == 12) {
                                Drupal.settings.Masonry.processnext = false;
                               $tilethrobber.remove();
                                $grid.masonry('layout');
                                $grid.after('<h2 id="theend" style="font-family: rancho, serif">The End</h2>');
                            }
                            getNextTile();
                        });
                    }
                }
            }

            getNextTile();

        }

    }
};