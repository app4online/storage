/* ===========================================================
 * trumbowyg.storage.js
 */

(function ($) {
    'use strict';

    var defaultOptions = {
        serverPath: '/',
    };

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                storage: 'Storage',
                file: 'File',
                uploadError: 'Upload error'
            },
            ru: {
                storage: 'Хранилище',
                file: 'Файл',
                uploadError: 'Ошибка загрузки'
            },
            ua: {
                storage: 'Сховище',
                file: 'Файл',
                uploadError: 'Помилка завантаження'
            },
        },
        // jshint camelcase:true

        plugins: {
            storage: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.storage = $.extend(true, {}, defaultOptions, trumbowyg.o.plugins.storage || {});
                    var btnDef = {

                        fn: function () {
                            trumbowyg.saveRange();

                            var progressBar = `
                            <div class="progress">
                              <div class="progress-bar progress-bar-striped active" role="progressbar" style="width:100%"></div>
                            </div>
                            `;
                            var html = `<div class="storageContent">${progressBar}</div>`;
                            var $modal = trumbowyg.openContainer(trumbowyg.lang.storage, html);

                            $.ajax(trumbowyg.o.plugins.storage.serverPath, {
                                method: 'get',
                                dataType: 'html',
                                success: function(data) {
                                    $('.trumbowyg-container').find('.storageContent').html(data);
                                    setTimeout(function () {
                                        $('.trumbowyg-container').on('click', 'div.image', function (e) {
                                            e.preventDefault();
                                            let link = $(this).css('background-image');
                                            var urlRegex = /(https?:\/\/[\w]+[^\s^'^"]+)/g;
                                            trumbowyg.execCmd('insertImage', link.match(urlRegex)[0]);
                                            trumbowyg.closeContainer();
                                        });
                                    }, 0);
                                }
                            });
                        }
                    };

                    trumbowyg.addBtnDef('storage', btnDef);
                }
            }
        }
    });

})(jQuery);
