#!/bin/bash
echo "Building static export for demo..."

# Backup original config
cp next.config.mjs next.config.mjs.backup 2>/dev/null || true

# Create temporary static config
cat > next.config.mjs << 'INNER_EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true
};
export default nextConfig;
INNER_EOF

# Build statically
npx next build

# RESTORE ORIGINAL CONFIG IMMEDIATELY
if [ -f next.config.mjs.backup ]; then
    mv next.config.mjs.backup next.config.mjs
else
    # If no backup existed, create minimal valid config
    echo "export default {};" > next.config.mjs
fi

echo "Original config restored. Static build complete."
