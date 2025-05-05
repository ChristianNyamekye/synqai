#!/bin/bash

# Generate 16x16 icon
svgexport icon.svg icon16.png 16:16

# Generate 48x48 icon
svgexport icon.svg icon48.png 48:48

# Generate 128x128 icon
svgexport icon.svg icon128.png 128:128

echo "Icons generated successfully!" 