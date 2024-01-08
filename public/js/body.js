document.addEventListener("DOMContentLoaded", function(){
    var navbarToggler = document.querySelector('.navbar-toggler');
    var navbarMenu = document.querySelector('.navbar-collapse');

    navbarToggler.addEventListener('click', function() {
        if (!navbarMenu.classList.contains('show')) {
            document.querySelector('.navbar').classList.add('navbar-expanded');
        } else {
            document.querySelector('.navbar').classList.remove('navbar-expanded');
        }
    });
});
