# IMDB Play Button

A minimal Chrome extension that adds a floating play button on IMDb title pages only.

## What it does

- Shows a floating circular play button only on IMDb movie title pages like `https://www.imdb.com/title/tt33014583/`
- Hides itself on all other IMDb pages
- On click, rewrites the URL to `https://www.playimdb.com/title/.../` and redirects there

## Install locally

1. Open Chrome and go to `chrome://extensions`
2. Enable Developer mode
3. Click Load unpacked
4. Select this folder

## Notes

The extension currently matches title pages with paths like `/title/tt1234567/`.
If IMDb changes its URL structure, the matching logic may need to be updated.