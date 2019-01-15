var path = '/';

function update(){
    loader.show();
    $.get('/index/update', {path: path, ajax: true}, function(content){
        $('[data-container]').html(content);
        loader.hide();
    });
}

function updateTree() {
    $.get('/index/tree', {path: '/', ajax: true}, (branch) => {
        $('#treeview-sidebar-primary').html(branch);
    });
}

function navigate(path){
    window.path = path;
    update();
}

function uploadFileComplete(error){

    loader.hide();
    $('[data-form-file]')[0].reset();

    if (error) {
        modal.alert('<div class="alert alert-dismissible alert-danger">' + error + '</div>');
        return;
    }

    update();
}

$(document).ready(function(){

    $(document).on('click', '[data-clipboard]', function(){
        $(this).closest('.bmd-fab-speed-dial-container').find('.press').removeClass('press');
        copyStringToClipboard($(this).data('clipboard'));
        return false;
    });

    $(document).on('click', '[data-reset-search]', function(){
        $('[data-search-form]')[0].reset();
        $('[data-search-form]').removeClass('editing');
        update();
        return false;
    });

    $(document).on('keyup', '[data-search-form] input', function(){
        if ($(this).val().length) {
            $(this).closest('[data-search-form]').addClass('editing');
        }
        else {
            $(this).closest('[data-search-form]').removeClass('editing');
        }
        $(this).blur();
    });

    $(document).on('submit', '[data-search-form]', function () {
        loader.show();
        $.get('/index/search', {path: path, query: $(this).find('input').val()}, (content) => {
            $('[data-container]').html(content);
            loader.hide();
        });

        return false;
    });

    $(document).on('click', '[data-sidebar-toggle]', function(){
        $('#treeview-sidebar-primary').toggleClass('bmd-sidebar-active');
    });

    $(document).on('click', '[data-navigate]', function(){
        navigate($(this).data('navigate'));
        return false;
    });

    $(document).on('click', '[data-tree]', function(){

        $.get('/index/tree', {path: $(this).data('tree'), ajax: true}, (branch) => {

            if ($(this).closest('li').find('ul').length) {
                $(this).closest('li').find('ul').replaceWith(branch);
            }
            else {
                $(this).closest('li').append(branch);
            }
        });

        return false;
    });

    $(document).on('click', '[data-delete-folder]', function(){
        $(this).closest('.bmd-fab-speed-dial-container').find('.press').removeClass('press');
        modal.confirm('Delete folder?', () => {
            $.get('/fs/delete-folder', {path: $(this).data('delete-folder')}, (r) => {
                if (r.status) {
                    update();
                    updateTree();
                }
            }, 'json');
        });
        return false;
    });

    $(document).on('click', '[data-delete-file]', function(){
        $(this).closest('.bmd-fab-speed-dial-container').find('.press').removeClass('press');
        modal.confirm('Delete file?', () => {
            $.get('/fs/delete-file', {path: $(this).data('delete-file')}, (r) => {
                if (r.status) {
                    update();
                }
            }, 'json');
        });
        return false;
    });

    $(document).on('click', '[data-select-file]', function(){

        $(this).closest('.bmd-fab-speed-dial-container').find('.press').removeClass('press');

        if (parent.selectImage) {
            parent.selectImage($(this).data('select-file'));
        }

        return false;
    });


    $('[data-upload=folder]').on('click', function(){
        $('[data-form] .bmd-fab-speed-dialer').click();
        modal.create($('#folder-upload').html(), 'Create folder');
        return false;
    });

    $(document).on('submit', '[data-create-folder-form]', function(){
        $.post('/fs/create-folder', {name: $(this).find('[name=name]').val(), path: path}, function(r){
            if (r.status) {
                modal.close();
                update();
                updateTree();
                return;
            }
            $('[data-create-folder-form] .error').show();
        }, 'json');
        return false;
    });




    $('[data-upload=url]').on('click', function(){
        $('[data-form] .bmd-fab-speed-dialer').click();
        modal.create($('#file-url-upload').html(), 'Upload by URL');
        return false;
    });

    $(document).on('submit', '[data-upload-by-url-form]', function(){
        $.post('/fs/upload-by-url', {url: $(this).find('[name=url]').val(), path: path}, function(r){
            if (r.status) {
                modal.close();
                update();
                return;
            }
            $('[data-upload-by-url-form] .error').show();
        }, 'json');
        return false;
    });





    $('[data-form-file] input').on('change', function(){
        loader.show();
        $(this).closest('.bmd-fab-speed-dial-container').find('.press').removeClass('press');
        $('[data-form-file]').find('[name=path]').val(path);
        $('[data-form-file]').submit();
    });


    $(document).on('click', '[data-type=image]', function () {

        var html = $(this).closest('[data-container]').html();
        modal.create(html, $(this).data('name'));
        return false;
    });

    $(document).on('click', '[data-modal][data-image]', function(){
        modal.create('<img class="fullscreen" src="' + $(this).data('image') + '" />', $(this).data('name'));
        return false;
    });

    $(document).on('click', '[data-modal-ajax]', function(){
        $.get($(this).data('modal-ajax'), (content) => {
            modal.create(content, $(this).data('modal-title'));
        });
        return false;
    });
});


function copyStringToClipboard (string) {

    function handler (event){
        event.clipboardData.setData('text/plain', string);
        event.preventDefault();
        document.removeEventListener('copy', handler, true);
    }

    document.addEventListener('copy', handler, true);
    document.execCommand('copy');
}