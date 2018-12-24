<?php

class FsController extends Default_Controller_Base
{
    public $status = true;
    public $message = '';

    public function createFolderAction()
    {
        try {

            $config = Zend_Registry::get('config');

            mkdir(realpath($config['fs']['path']) . $this->getParam('path') . '/' . $this->getParam('name'));
        }
        catch (Exception $e) {
            $this->status = false;
        }
    }

    public function deleteFolderAction()
    {
        try {

            $config = Zend_Registry::get('config');
            $dirPath = realpath($config['fs']['path']) . $this->getParam('path');

            self::deleteDir($dirPath);
        }
        catch (Exception $e) {
            $this->status = false;
        }
    }

    public function uploadFileAction()
    {
        $files = array_map(function($name, $type, $tmpName, $error, $size){
            return [
                'name' => $name,
                'type' => $type,
                'tmpName' => $tmpName,
                'error' => $error,
                'size' => $size
            ];

        },  $_FILES['files']['name'],
            $_FILES['files']['type'],
            $_FILES['files']['tmp_name'],
            $_FILES['files']['error'],
            $_FILES['files']['size']
        );

        $errors = [];

        $config = Zend_Registry::get('config');

        foreach ($files as $file) {

            try {
                copy($file['tmpName'], realpath($config['fs']['path']) . $this->getParam('path') . '/' . $file['name']);
            }
            catch (Exception $e) {
                $errors[] = 'File "' . $file['name'] . '" was not uploaded.';
            }
        }

        die("<script>parent.uploadFileComplete('" . implode('<br>', $errors) . "');</script>");
    }

    public function deleteFileAction()
    {
        try {

            $config = Zend_Registry::get('config');
            $dirPath = realpath($config['fs']['path']) . $this->getParam('path');

            unlink($dirPath);
        }
        catch (Exception $e) {
            $this->status = false;
        }
    }

    public function uploadByUrlAction()
    {
        try {

            $url = explode('/', $this->getParam('url'));
            $name = $url[count($url)-1];

            $file = file_get_contents($this->getParam('url'));

            $config = Zend_Registry::get('config');

            file_put_contents(realpath($config['fs']['path']) . $this->getParam('path') . '/' . $name, $file);
        }
        catch (Exception $e) {
            $this->status = false;
        }
    }


    public static function deleteDir($dirPath)
    {
        if (! is_dir($dirPath)) {
            throw new InvalidArgumentException("$dirPath must be a directory");
        }

        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }

        $files = glob($dirPath . '*', GLOB_MARK);

        foreach ($files as $file) {

            if (is_dir($file)) {
                self::deleteDir($file);
            }
            else {
                unlink($file);
            }
        }
        rmdir($dirPath);
    }


    public function postDispatch()
    {
        die(json_encode([
            'status'      => $this->status,
            'message'     => $this->message,
        ]));
    }
}