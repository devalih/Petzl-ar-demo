(function() {
    var gmaps = document.createElement('script'); gmaps.type = 'text/JavaScript'; gmaps.async = true;
    gmaps.src = 'https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyAIJHxB0z-0d4dHeet0McogxMjHTcks9WY&callback=initGmaps';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gmaps, s);
})();
