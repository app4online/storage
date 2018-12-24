window.loader = {

    show: function () {
        $('body').addClass('loading');
        $('.loader').show();
    },

    hide: function () {
        $('body').removeClass('loading');
        $('.loader').hide();
    }
};