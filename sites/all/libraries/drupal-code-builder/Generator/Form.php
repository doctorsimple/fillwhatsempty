<?php

/**
 * @file
 * Contains DrupalCodeBuilder\Generator\Form.
 */

namespace DrupalCodeBuilder\Generator;

/**
 * Generator class for forms on Drupal 8.
 */
class Form extends PHPClassFile {

  /**
   * An array of data about injected services.
   */
  protected $injectedServices = [];

  /**
   * Constructor method; sets the component data.
   *
   * @param $component_name
   *   The identifier for the component.
   * @param $component_data
   *   (optional) An array of data for the component. Any missing properties
   *   (or all if this is entirely omitted) are given default values.
   */
  function __construct($component_name, $component_data, $root_generator) {
    // Set some default properties.
    $component_data += array(
      'injected_services' => [],
      // TODO: should be in default value callback.
      'form_id' => $component_data['root_component_name'] . '_' . strtolower($component_data['form_class_name']),
    );

    // TODO: this should be done in a property processing callback.
    $component_data['form_class_name'] = ucfirst($component_data['form_class_name']);

    $component_data['relative_class_name'] = ['Form', $component_data['form_class_name']];

    //ddpr($component_data);

    parent::__construct($component_name, $component_data, $root_generator);
  }

  /**
   * Return a unique ID for this component.
   *
   * @return
   *  The unique ID
   */
  public function getUniqueID() {
    return $this->type . ':' . $this->component_data['form_id'];
  }

  /**
   * Define the component data this component needs to function.
   */
  public static function componentDataDefinition() {
    return parent::componentDataDefinition() + array(
      'form_class_name' => array(
        'label' => 'Form class name',
        'required' => TRUE,
      ),
      'injected_services' => array(
        'label' => 'Injected services',
        'format' => 'array',
        'options' => function(&$property_info) {
          $mb_task_handler_report_services = \DrupalCodeBuilder\Factory::getTask('ReportServiceData');

          $options = $mb_task_handler_report_services->listServiceNamesOptions();

          return $options;
        },
        'options_allow_other' => TRUE,
      ),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function requiredComponents() {
    $form_name = $this->component_data['form_id'];

    $components = array(
      // Request the form functions.
      'getFormId' => array(
        'component_type' => 'PHPMethod',
        'code_file' => $this->name,
        'code_file_id' => $this->getUniqueId(),
        'doxygen_first' => '{@inheritdoc}',
        'declaration' => 'public function getFormId()',
        'body' => array(
          "return '$form_name';",
        ),
        'body_indent' => 2,
      ),
      'buildForm' => array(
        'component_type' => 'PHPMethod',
        'code_file' => $this->name,
        'code_file_id' => $this->getUniqueId(),
        'doxygen_first' => 'Form constructor.',
        'declaration' => 'public function buildForm(array $form, FormStateInterface $form_state)',
        'body' => array(
          "£form['element'] = array(",
          "  '#type' => 'textfield',",
          "  '#title' => t('Enter a value'),",
          "  '#required' => TRUE,",
          ");",
          "",
          "return £form;",
        ),
        'body_indent' => 2,
      ),
      'submitForm' => array(
        'component_type' => 'PHPMethod',
        'code_file' => $this->name,
        'code_file_id' => $this->getUniqueId(),
        'doxygen_first' => 'Form submission handler.',
        'declaration' => 'public function submitForm(array &$form, FormStateInterface $form_state)',
        'body' => '',
        'body_indent' => 2,
      ),
    );

    foreach ($this->component_data['injected_services'] as $service_id) {
      $components[$this->name . '_' . $service_id] = array(
        'component_type' => 'InjectedService',
        'container' => $this->getUniqueID(),
        'service_id' => $service_id,
      );
    }

    return $components;
  }

  /**
   * {@inheritdoc}
   */
  function buildComponentContents($children_contents) {
    // TEMPORARY, until Generate task handles returned contents.
    $this->functions = $this->filterComponentContentsForRole($children_contents, 'function');
    $this->injectedServices = $this->filterComponentContentsForRole($children_contents, 'service');
    $this->childContentsGrouped = $this->groupComponentContentsByRole($children_contents);

    return array();
  }

  /**
   * Produces the class declaration.
   */
  function class_declaration() {
    $this->component_data['parent_class_name'] = '\Drupal\Core\Form\FormBase';

    return parent::class_declaration();
  }

  /**
   * Return the body of the class's code.
   */
  protected function classCodeBody() {
    // TODO: this code sets up class properties for the parent classCodeBody()
    // to work with, as if they had been set by buildComponentContents().
    // This should be refactored in due course.
    // Injected services.
    // TODO: refactor this along with Plugin to a parent class.
    if (!empty($this->injectedServices)) {
      foreach ($this->injectedServices as $service_info) {
        $property_code = $this->docBlock([
          $service_info['description'] . '.',
          '',
          '@var ' . $service_info['interface']
        ]);
        $property_code[] = 'protected $' . $service_info['property_name'] . ';';

        $this->properties[] = $property_code;
      }

      // __construct() method
      $this->constructor = $this->codeBodyClassMethodConstruct();

      // create() method.
      // Function data has been set by buildComponentContents().
      // Goes first in the functions.
      $this->functions = array_merge([$this->codeBodyClassMethodCreate()], $this->functions);
    }

    return parent::classCodeBody();
  }

  /**
   * Creates the code lines for the __construct() method.
   */
  protected function codeBodyClassMethodConstruct() {
    $parameters = [];
    foreach ($this->childContentsGrouped['constructor_param'] as $service_parameter) {
      $parameters[] = $service_parameter;
    }

    $code = $this->buildMethodHeader(
      '__construct',
      $parameters,
      [
        'docblock_first_line' => "Creates a {$this->plain_class_name} instance.",
        'prefixes' => ['public'],
      ]
    );

    foreach ($this->injectedServices as $service_info) {
      $code[] = "  \$this->{$service_info['property_name']} = \${$service_info['variable_name']};";
    }
    $code[] = '}';

    return $code;
  }

  /**
   * Creates the code lines for the create() method.
   */
  protected function codeBodyClassMethodCreate() {
    $parameters = [
      [
        'name' => 'container',
        'typehint' => '\\Symfony\\Component\\DependencyInjection\\ContainerInterface',
      ],
    ];

    $code = $this->buildMethodHeader(
      'create',
      $parameters,
      [
        'inheritdoc' => TRUE,
        'prefixes' => ['public', 'static'],
      ]
    );

    $code[] = '  return new static(';

    $container_extraction_lines = [];
    foreach ($this->childContentsGrouped['container_extraction'] as $container_extraction) {
      $container_extraction_lines[] = '    ' . $container_extraction;
    }

    // Remove the last comma.
    end($container_extraction_lines);
    $last_line_key = key($container_extraction_lines);
    $container_extraction_lines[$last_line_key] = rtrim($container_extraction_lines[$last_line_key], ',');
    $code = array_merge($code, $container_extraction_lines);

    $code[] = '  );';
    $code[] = '}';

    return $code;
  }

}
