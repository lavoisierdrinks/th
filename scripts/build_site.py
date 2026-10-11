#!/usr/bin/env python3
"""Create the GitHub Pages package using only Python's standard library."""
from pathlib import Path
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
ARCHIVE = ROOT / 'lavoisier-drinks-github.zip'


def main():
    # Preserve the original brand images without duplicating binary assets in Git.
    with zipfile.ZipFile(ARCHIVE) as previous:
        assets = {
            name: previous.read(name)
            for name in previous.namelist()
            if name.startswith('images/') or name in ('og.png', 'favicon.svg')
        }
    required = {'images/limao.webp', 'images/morango.webp', 'images/maracuja.webp',
                'images/logo-lavoisier.png', 'favicon.svg', 'og.png'}
    if not required.issubset(assets):
        raise RuntimeError('The existing package is missing required brand assets.')
    files = dict(assets)
    files.update({p.relative_to(SITE).as_posix(): p.read_bytes()
                  for p in SITE.rglob('*') if p.is_file()})
    with tempfile.NamedTemporaryFile(dir=ROOT, suffix='.zip', delete=False) as temp:
        output = Path(temp.name)
    try:
        with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as package:
            for name, data in sorted(files.items()):
                entry = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
                entry.compress_type = zipfile.ZIP_DEFLATED
                entry.external_attr = 0o100644 << 16
                package.writestr(entry, data)
        with zipfile.ZipFile(output) as package:
            if package.testzip():
                raise RuntimeError('Generated ZIP failed integrity validation.')
        output.replace(ARCHIVE)
    finally:
        output.unlink(missing_ok=True)
    print(f'Built {ARCHIVE.name}: {len(files)} files')


if __name__ == '__main__':
    main()
