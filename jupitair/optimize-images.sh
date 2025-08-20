#!/bin/bash

# Create optimized directory if it doesn't exist
mkdir -p public/images/blog/optimized

# Function to optimize a single image
optimize_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local name="${filename%.*}"
    local output_webp="public/images/blog/optimized/${name}.webp"
    local output_jpg="public/images/blog/optimized/${name}.jpg"
    
    echo "Optimizing $filename..."
    
    # Create WebP version (highest compression)
    if command -v cwebp &> /dev/null; then
        cwebp -q 80 -resize 1920 0 "$input_file" -o "$output_webp" 2>/dev/null
    fi
    
    # Create optimized JPG version (fallback)
    if command -v convert &> /dev/null; then
        convert "$input_file" -resize 1920x -quality 85 -sampling-factor 4:2:0 -strip "$output_jpg"
    elif command -v sips &> /dev/null; then
        # macOS fallback using sips
        sips -Z 1920 --setProperty formatOptions 85 "$input_file" --out "$output_jpg" 2>/dev/null
    fi
}

# Process all blog images
echo "Starting blog image optimization..."
for file in public/images/blog/*.jpg; do
    if [ -f "$file" ]; then
        optimize_image "$file"
    fi
done

echo "Optimization complete!"
echo "Original sizes:"
du -sh public/images/blog/*.jpg | head -5

echo ""
echo "Optimized sizes:"
ls -lah public/images/blog/optimized/ | head -10