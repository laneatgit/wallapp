;(function(){

    // Menu settings
    $('#menuToggle, .menu-close').on('click', function(){
        $('#menuToggle').toggleClass('active');
        $('body').toggleClass('body-push-toleft');
        $('#theMenu').toggleClass('menu-open');
    });

    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
    
            
})(jQuery)