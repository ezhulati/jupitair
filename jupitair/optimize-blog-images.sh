#!/bin/bash

# Create backup first
mkdir -p public/images/blog/original-backup
cp public/images/blog/*.jpg public/images/blog/original-backup/ 2>/dev/null

echo "Starting aggressive image optimization..."
echo "Original total size:"
du -sh public/images/blog/*.jpg | tail -1

# Process each image in place with sips (macOS built-in)
for file in public/images/blog/*.jpg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "Optimizing $filename..."
        
        # Resize to max 1200px width and reduce quality to 75%
        sips -Z 1200 --setProperty formatOptions 75 "$file" --out "$file" 2>/dev/null
    fi
done

echo ""
echo "Optimization complete!"
echo "New total size:"
du -sh public/images/blog/*.jpg | tail -1
echo ""
echo "Size comparison (first 10 files):"
for file in public/images/blog/*.jpg | head -10; do
    if [ -f "$file" ]; then
        new_size=$(du -h "$file" | cut -f1)
        filename=$(basename "$file")
        original="public/images/blog/original-backup/$filename"
        if [ -f "$original" ]; then
            old_size=$(du -h "$original" | cut -f1)
            echo "$filename: $old_size -> $new_size"
        fi
    fi
done