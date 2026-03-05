// Lite YouTube Embed - Only loads iframe on click
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.youtube-lite').forEach(function(element) {
        element.addEventListener('click', function() {
            if (this.classList.contains('activated')) {
                return;
            }

            // Mark as activated to hide overlays via CSS
            this.classList.add('activated');

            const videoId = this.dataset.videoid;
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1`);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('title', this.getAttribute('aria-label') || 'YouTube video');
            this.innerHTML = '';
            this.appendChild(iframe);
        });
    });
});
