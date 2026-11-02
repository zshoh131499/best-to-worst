"""Inline the bundle, styles, and generated category art for offline play.
Run esbuild dist/app.js --bundle --format=iife --minify --outfile=/private/tmp/best-to-worst-bundle.js first.
"""
from pathlib import Path
import base64
root=Path(__file__).resolve().parents[1]
html=(root/'dist/index.html').read_text()
bundle=Path('/private/tmp/best-to-worst-bundle.js').read_text()
for asset in (root/'dist/assets/categories').glob('*.png'):
    bundle=bundle.replace('assets/categories/'+asset.name,'data:image/png;base64,'+base64.b64encode(asset.read_bytes()).decode())
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+(root/'dist/style.css').read_text()+'</style>')
html=html.replace('<script type="module" src="app.js"></script>','<script>'+bundle.replace('</script','<\\/script')+'</script>')
(root/'Best to Worst.html').write_text(html)
(root/'dist/standalone.html').write_text(html)
