<?php

class IndexController extends Default_Controller_Base
{
    public function init()
    {
        parent::init();

        $this->view->path = $this->getParam('path', '/');

        if ($this->getParam('ajax') == 'true' || $this->getRequest()->isXmlHttpRequest()) {
            $this->_helper->layout()->disableLayout();
        }
    }

    public function searchAction()
    {
        try {
            $config = Zend_Registry::get('config');

            $path = $config['fs']['path'];

            if ($this->getParam('path')) {
                $path = $path . '/' . $this->getParam('path');
            }

            $it = new RecursiveDirectoryIterator(realpath($path));

            $files = [];

            foreach(new RecursiveIteratorIterator($it) as $file) {

                $fileName = substr(realpath((string)$file), strlen(realpath($path)));

                if (empty($fileName)) {
                    continue;
                }

                if (strpos(basename($fileName), $this->getParam('query')) !== false) {

                    $files[] = [
                        'name' => basename($fileName),
                        'path' => $fileName,
                        'time' => filemtime(realpath($file)),
                        'mime' => mime_content_type(realpath($file)),
                        'url'  => Zend_Registry::get('config')['fs']['url'] . $fileName
                    ];
                }
            }
        }
        catch (Exception $e) {
            $files = [];
        }

        $this->view->files = $files;
        $this->view->query = $this->getParam('query');
    }

    public function downloadAction()
    {
        $file = realpath(Zend_Registry::get('config')['fs']['path'] . $this->getParam('path'));

        header('Content-Type: application/octet-stream');
        header("Content-Transfer-Encoding: Binary");
        header("Content-disposition: attachment; filename=\"" . basename($file) . "\"");

        readfile($file);

        die();
    }

    public function indexAction(){}
    public function updateAction(){}
    public function treeAction(){}
}