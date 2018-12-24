<?php

/**
 * Class App_Plugin_Error
 *
 * Switching to the appropriate error handling controller according to module
 */
class App_Plugin_Error extends Zend_Controller_Plugin_Abstract
{
    /**
     * Switching to the appropriate error handling controller according to module
     *
     * @param Zend_Controller_Request_Abstract $request
     *
     * @return void
     */
    public function routeShutdown(Zend_Controller_Request_Abstract $request)
    {
        $front = Zend_Controller_Front::getInstance();
        $front->throwExceptions(false);

        $plugin = $front->getPlugin('Zend_Controller_Plugin_ErrorHandler');

        if (!($plugin instanceof Zend_Controller_Plugin_ErrorHandler)) {
            return;
        }

        $plugin->setErrorHandlerModule($request->getModuleName());
        $plugin->setErrorHandlerController('error');
        $plugin->setErrorHandlerAction('error');
    }
}