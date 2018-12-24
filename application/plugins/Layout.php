<?php

/**
 * Class App_Plugin_Layout
 *
 * Switching to the appropriate layout according to module
 */
class App_Plugin_Layout extends Zend_Controller_Plugin_Abstract
{
    /**
     * Switching to the appropriate layout according to module
     *
     * @param Zend_Controller_Request_Abstract $request
     *
     * @return void
     */
    public function preDispatch(Zend_Controller_Request_Abstract $request)
    {
        Zend_Layout::startMvc(array(
            'layoutPath' => array(APPLICATION_PATH.'/modules/'.$request->getModuleName().'/views/layouts/',),
            'layout' => 'index'
        ));
    }
}