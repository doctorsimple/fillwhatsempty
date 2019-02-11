<?php

function version_comparator_views_default_views() {

//Create the view used by the module
$view = new view();
$view->name = 'version_comparator_book';
$view->description = '';
$view->tag = 'default';
$view->base_table = 'node';
$view->human_name = 'VC Book';
$view->core = 7;
$view->api_version = '3.0';
$view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

/* Display: Master */
$handler = $view->new_display('default', 'Master', 'default');
$handler->display->display_options['title'] = '<none>';
    $handler->display->display_options['use_ajax'] = TRUE;
    $handler->display->display_options['use_more_always'] = FALSE;
    $handler->display->display_options['access']['type'] = 'perm';
    $handler->display->display_options['cache']['type'] = 'none';
    $handler->display->display_options['query']['type'] = 'views_query';
    $handler->display->display_options['exposed_form']['type'] = 'basic';
    $handler->display->display_options['pager']['type'] = 'none';
    $handler->display->display_options['pager']['options']['offset'] = '0';
    $handler->display->display_options['style_plugin'] = 'default';
    $handler->display->display_options['row_plugin'] = 'fields';
    /* Header: Global: Text area */
    $handler->display->display_options['header']['area']['id'] = 'area';
    $handler->display->display_options['header']['area']['table'] = 'views';
    $handler->display->display_options['header']['area']['field'] = 'area';
    $handler->display->display_options['header']['area']['content'] = '<div class="vc-book-header"><span class="translator-name">%1</span></div>';
    $handler->display->display_options['header']['area']['format'] = 'full_html';
    $handler->display->display_options['header']['area']['tokenize'] = TRUE;
    /* Field: Content: Title */
    $handler->display->display_options['fields']['title']['id'] = 'title';
    $handler->display->display_options['fields']['title']['table'] = 'node';
    $handler->display->display_options['fields']['title']['field'] = 'title';
    $handler->display->display_options['fields']['title']['label'] = '';
    $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
    $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
    /* Field: Content: Text */
    $handler->display->display_options['fields']['version_comparator_text']['id'] = 'version_comparator_text';
    $handler->display->display_options['fields']['version_comparator_text']['table'] = 'field_data_version_comparator_text';
    $handler->display->display_options['fields']['version_comparator_text']['field'] = 'version_comparator_text';
    $handler->display->display_options['fields']['version_comparator_text']['label'] = '';
    $handler->display->display_options['fields']['version_comparator_text']['element_label_colon'] = FALSE;
    /* Sort criterion: Content: Chapter (version_comparator_chapter) */
    $handler->display->display_options['sorts']['version_comparator_chapter_value']['id'] = 'version_comparator_chapter_value';
    $handler->display->display_options['sorts']['version_comparator_chapter_value']['table'] = 'field_data_version_comparator_chapter';
    $handler->display->display_options['sorts']['version_comparator_chapter_value']['field'] = 'version_comparator_chapter_value';
    /* Contextual filter: Content: Translator (version_comparator_translator) */
    $handler->display->display_options['arguments']['version_comparator_translator_value']['id'] = 'version_comparator_translator_value';
    $handler->display->display_options['arguments']['version_comparator_translator_value']['table'] = 'field_data_version_comparator_translator';
    $handler->display->display_options['arguments']['version_comparator_translator_value']['field'] = 'version_comparator_translator_value';
    $handler->display->display_options['arguments']['version_comparator_translator_value']['default_action'] = 'summary';
    $handler->display->display_options['arguments']['version_comparator_translator_value']['default_argument_type'] = 'fixed';
    $handler->display->display_options['arguments']['version_comparator_translator_value']['summary']['number_of_records'] = '0';
    $handler->display->display_options['arguments']['version_comparator_translator_value']['summary']['format'] = 'default_summary';
    $handler->display->display_options['arguments']['version_comparator_translator_value']['summary_options']['items_per_page'] = '25';
    $handler->display->display_options['arguments']['version_comparator_translator_value']['limit'] = '0';
    /* Filter criterion: Content: Type */
    $handler->display->display_options['filters']['type']['id'] = 'type';
    $handler->display->display_options['filters']['type']['table'] = 'node';
    $handler->display->display_options['filters']['type']['field'] = 'type';
    $handler->display->display_options['filters']['type']['value'] = array(
    'vc_section' => 'vc_section',
    );

    /* Display: Block */
    $handler = $view->new_display('block', 'Block', 'block');


    $views[$view->name] = $view;
    return $views;
    }
