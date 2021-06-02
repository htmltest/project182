window.onload = function() {
    var html = document.documentElement;

    var fontsfile = document.createElement('link');
    fontsfile.href = pathTemplate + 'css/fonts.css';
    fontsfile.rel = 'stylesheet';
    document.head.appendChild(fontsfile);

    if (sessionStorage.fontsLoaded) {
        html.classList.add('fonts-loaded');
    } else {
        var script = document.createElement('script');
        script.src = pathTemplate + 'js/fontfaceobserver.js';
        script.async = true;

        script.onload = function () {
            var Inter300 = new FontFaceObserver('Inter', {
                weight: '300'
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
                Inter400.load(),
                Inter500.load(),
                Steinbeck400.load()
            ]).then(function () {
                html.classList.add('fonts-loaded');
                sessionStorage.fontsLoaded = true;
            });
        };
        document.head.appendChild(script);
    }
}