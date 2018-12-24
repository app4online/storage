window.modal = {

    confirm: function (text, callback, title) {

        this.create(text, title || 'Confirm', {
            'Yes': {
                callback: () => {

                    this.get().modal('hide');

                    setTimeout(() => {

                        callback();

                    }, 500);
                },
                'style' : 'primary'
            },
            'No': {callback: () => {
                this.get().modal('hide');
            }}
        });
    },

    alert: function (text, title) {

        this.create(text, title || 'Message', {
            OK: {
                callback: () => {
                    this.get().modal('hide');
                },
                style: 'primary'
            }
        });
    },

    create: function (text, title, buttons) {

        if (!buttons) {
            buttons = {};
        }

        this.prepare((modal) => {

            modal.find('.modal-title').html(title || 'Message');
            modal.find('.modal-body').html(text);

            var modalFooter = modal.find('.modal-footer');
            var buttonsTemplate = modal.find('.modal-footer').html();

            modal.find('.modal-footer').html('');

            if (!Object.keys(buttons).length) {
                modal.find('.modal-footer').css({'display': 'none'});
            }

            $.each(buttons, (title, options) => {

                modalFooter.append(buttonsTemplate);

                var button = modalFooter.find('button:last');
                button.html(title);

                button.addClass('btn-' + (options.style || 'default'));

                if (options.callback) {
                    button.click(options.callback);
                }
            });

            modal.on('hidden.bs.modal', () => {
                this.get().remove();
            });

            modal.modal('show');
        });
    },

    prepare: function(callback){

        var modal = $('#modal');

        if (this.get().length) {

            this.get().modal('hide');

            setTimeout(() => {

                $('body').append(this.getTemplate());
                callback(this.get());

            }, 500);

            return;
        }

        $('body').append(this.getTemplate());
        callback(this.get());
    },

    get: function () {
        return $('#modal');
    },

    getTemplate: function () {
        return $('#modal-template').html();
    },

    close: function(){
        this.get().modal('hide');
    }
};
