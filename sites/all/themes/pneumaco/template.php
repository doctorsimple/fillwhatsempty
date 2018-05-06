<?php
/**
 * @file
 * The primary PHP file for this theme.
 */

function pneumaco_menu_tree__main_menu($variables)
{
    return '<ul class="nav nav-stacked nav-pills" id="mainmenu">' . $variables['tree'] . '</ul>';

}

/* Template overrides */
    $variables['content_column_class'] = ' class="col-sm-10"';