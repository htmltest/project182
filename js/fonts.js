window.onload = function() {
    var html = document.documentElement;

    var fontsfile = document.createElement('link');
    fontsfile.href = pathTemplate + 'css/fonts.css';
    fontsfile.rel = 'stylesheet';
    document.head.appendChild(fontsfile);

    if (sessionStorage.fontsLoaded) {
        html.classList.add('fonts-loaded');
        $(window).trigger('resize');
    } else {
        var script = document.createElement('script');
        script.src = pathTemplate + 'js/fontfaceobserver.js';
        script.async = true;

        script.onload = function () {
            var Inter300 = new FontFaceObserver('Inter', {
                weight: '300'
            });
            var Inter300i = new FontFaceObserver('Inter', {
                weight: '300',
                style: 'italic'
            });
            var Inter400 = new FontFaceObserver('Inter', {
                weight: 'normal'
            });
            var Inter500 = new FontFaceObserver('Inter', {
                weight: '500'
            });
            var Steinbeck400 = new FontFaceObserver('Steinbeck', {
                weight: 'normal'
            });

            Promise.all([
                Inter300.load(),
                Inter300i.load(),
                Inter400.load(),
                Inter500.load(),
                Steinbeck400.load()
            ]).then(function () {
                html.classList.add('fonts-loaded');
                sessionStorage.fontsLoaded = true;
                $(window).trigger('resize');
            });
        };
        document.head.appendChild(script);
    }
}