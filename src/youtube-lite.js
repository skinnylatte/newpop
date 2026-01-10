// Lite YouTube Embed - Only loads iframe on click
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.youtube-lite').forEach(function(element) {
        element.addEventListener('click', function() {
            const videoId = this.dataset.videoid;
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1`);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            this.innerHTML = '';
            this.appendChild(iframe);
        });
    });
});
