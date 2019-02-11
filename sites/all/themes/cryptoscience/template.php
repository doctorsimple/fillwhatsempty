<?php
/**
 * @file
 * The primary PHP file for this theme.
 */
/**
 * Variables preprocess function for the "page" theming hook.
 */
function cryptoscience_preprocess_page(&$vars)
{

    // Do we have a node?
    if (isset($vars['node'])) {

        // Ref suggestions cuz it's stupid long.
        $suggests = &$vars['theme_hook_suggestions'];

        // Get path arguments.
        $args = arg();
        // Remove first argument of "node".
        unset($args[0]);

        // Set type.
        $type = "page__{$vars['node']->type}";

        $setting = array( 'pagetype' => $type);
        if ($vars['is_front'] == true) {
            $setting['pagetype'] = 'frontpage';
        }
        if ($vars['node']->nid == 2168) {
        	$setting['pagetype'] = 'page__ttc_comparator';
        }
        drupal_add_js($setting, 'setting');

        // Bring it all together.
        $suggests = array_merge(
            $suggests,
            array($type),
            theme_get_suggestions($args, $type)
        );

        //WOTD page vars
        if ($vars['node']->nid == 641) {
            $query = new EntityFieldQuery();
            $query-> entityCondition('entity_type','node')
            ->entityCondition('bundle','word_of_the_day')
            ->propertyCondition('status', NODE_PUBLISHED)
            ->fieldCondition('field_pub_date','value','NULL','!=')
            ->fieldCondition('field_pub_date','value',  date('Y-m-d H:i:s'), '<=')
            ->fieldOrderBy('field_pub_date', 'value', 'DESC')
            ->range('NULL',1);

            $result = $query->execute();

            $vars['todaywordwrapper'] = entity_metadata_wrapper('node', node_load(array_keys($result['node'])[0]));
            $vars['wotdrowcount'] = count(views_get_view_result('past_wotd', 'default'));



        }
        // TTC comparator page
//        if ($vars['node']->nid == 2168) {
//        	//krumo (field_info_instances('node','ttc_verse'));
//        	$result = db_query('SELECT DISTINCT field_translator_value FROM {field_data_field_translator} ');
//
//        	while ($row = $result->fetchAssoc()) {
//        		$translatorlist[] = $row['field_translator_value'];
//        	}
//
//        	$vars['translatorlist'] = $translatorlist;
//        }
    }

    if ($vars['is_front'] == true) {
        //libraries_load('paper');
    }
}

function cryptoscience_query_alter($query) {
    if ($query->hasTag('efq_debug') && module_exists('devel')) {
        dpm((string) $query);
        dpm($query->arguments());
    }
}

