<?php

/**
 * Class ErrorController
 */
class ErrorController extends Default_Controller_Base
{
    /**
     * Container with error description
     *
     * @var ArrayObject
     */
    protected $_errors = null;

    public function errorAction()
    {
        $errors = $this->_getParam('error_handler');

        if (!$errors || !$errors instanceof ArrayObject) {
            return;
        }

        die(json_encode([
            'status' => false,
            'message' => $errors->exception->getMessage(),
        ]));
    }
}