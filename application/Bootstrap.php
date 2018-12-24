<?php

/**
 * Class Bootstrap
 *
 * Serves for configuration and pre-load required components and plugins
 */
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    /**
     * Now configuration are available from the Registry
     *
     * @return void
     */
    protected function _initConfig()
    {
        Zend_Registry::set('config', $this->getOptions());
    }

    /**
     * Initialize pseudo-namespaces,
     * auto-loader and resource groups
     *
     * @throws Zend_Loader_Exception
     */
    protected function _initAutoloader()
    {
        $modules = ['default'];

        foreach ($modules as $module) {

            $moduleLoader = new Zend_Application_Module_Autoloader([
                'namespace' => ucfirst($module),
                'basePath' => APPLICATION_PATH.'/modules/'.$module
            ]);

            $moduleLoader->addResourceTypes([
                'controller' => [
                    'namespace' => 'Controller',
                    'path' => 'controllers'
                ]
            ]);
        }

        $appResources = new Zend_Loader_Autoloader_Resource([
            'basePath' => APPLICATION_PATH,
            'namespace' => 'App',
        ]);

        $appResources->addResourceTypes([
            'plugins' => [
                'namespace' => 'Plugin',
                'path' => 'plugins'
            ],
        ]);
    }

    /**
     * Initialize error-handler
     * On all notices, warnings and errors will be thrown App_Exception_Error
     *
     * @return void
     */
    protected function _initErrorHandler()
    {
        set_error_handler(function($number, $message, $file, $line) {
            throw new Exception($message.":".$file.":".$line, 404);
        });
    }
}