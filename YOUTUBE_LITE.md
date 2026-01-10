# YouTube Lite Embed

For better performance, use the custom `{% youtube %}` shortcode instead of regular YouTube URLs.

## Usage

In your markdown files:

```
{% youtube "VIDEO_ID" "Video Title" %}
```

**Example:**
```
{% youtube "X9gGYZ9G_d4" "North Bay Python Talk" %}
```

## Benefits

- **No YouTube JS loads until user clicks** (saves ~775 KiB)
- **No YouTube CSS loads until user clicks** (saves ~59 KiB)
- **Faster page load** - Only loads thumbnail image initially
- **Better Core Web Vitals** - Eliminates long main-thread tasks

## How It Works

1. Shows YouTube thumbnail with play button overlay
2. Only loads full YouTube iframe when user clicks to play
3. Uses youtube-nocookie.com domain for privacy
4. Autoplay starts when clicked

## Migrating Existing Embeds

Replace this:
```
https://www.youtube.com/watch?v=X9gGYZ9G_d4
```

With this:
```
{% youtube "X9gGYZ9G_d4" "Video description" %}
```

To get the video ID from a YouTube URL:
- From `https://www.youtube.com/watch?v=X9gGYZ9G_d4`
- Extract: `X9gGYZ9G_d4`
