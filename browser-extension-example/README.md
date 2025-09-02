# Browser Extension Example for OpenAI Edge TTS

This is a simple browser extension example that demonstrates how to use the OpenAI Edge TTS API with CORS enabled.

## Installation

1. Make sure the OpenAI Edge TTS server is running with CORS enabled:
   ```bash
   cd /path/to/openai-edge-tts
   docker compose up --build
   ```

2. Load the extension in Chrome/Edge:
   - Open browser and navigate to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `browser-extension-example` folder

## Usage

1. Click the extension icon in your browser toolbar
2. (Optional) Enter your API key if the server requires authentication
3. Enter the text you want to convert to speech
4. Select a voice
5. Adjust the speed if needed
6. Click "Generate Speech"
7. The audio will play automatically

## Features

- Text-to-speech conversion
- Multiple voice options
- Speed control (0.5x to 2.0x)
- API key storage
- Clean and modern UI
- Keyboard shortcut (Ctrl/Cmd + Enter to generate)

## Icon Note

The extension uses an SVG icon (`icon.svg`). For production use, you should:
1. Convert the SVG to PNG format in multiple sizes (16x16, 48x48, 128x128)
2. Name them as `icon.png` or update the manifest.json with specific filenames

## Security Considerations

- API keys are stored in browser's local storage
- Only connects to localhost by default
- To connect to remote servers, update `host_permissions` in manifest.json

## Customization

### Change API endpoint
Edit `popup.js` and change:
```javascript
const API_URL = 'http://localhost:5050';
```

### Add more voices
Edit `popup.html` and add more options to the voice select element.

### Change styling
Modify `popup.css` to customize the appearance.

## Troubleshooting

### CORS errors
- Ensure the server is running with `CORS_ENABLED=True`
- Check that the server URL in `popup.js` matches your server configuration

### API key issues
- Verify the API key is correct
- Check if the server has `REQUIRE_API_KEY=True` set

### No audio playback
- Check browser console for errors
- Ensure the server is generating audio files correctly
- Verify the response format is supported (default: mp3)