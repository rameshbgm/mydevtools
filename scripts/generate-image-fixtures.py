"""Regenerate original public metadata fixtures; requires Pillow 12 with WebP/AVIF."""
from pathlib import Path
import struct
from PIL import Image, ImageCms, PngImagePlugin, TiffImagePlugin
root = Path(__file__).parent / 'fixtures' / 'images'
root.mkdir(parents=True, exist_ok=True)
image = Image.new('RGBA', (48, 32))
for y in range(32):
    for x in range(48):
        image.putpixel((x, y), ((x * 5) % 256, (y * 7) % 256, ((x + y) * 3) % 256, 255 if x > 5 else 128))
def make_exif():
    exif = Image.Exif()
    exif[271] = 'PUBLIC-FIXTURE-CAMERA'
    exif[315] = 'Public fixture artist'
    exif[274] = 6
    exif[306] = '2026:10:19 00:00:00'
    exif[34853] = {1: 'N', 2: (TiffImagePlugin.IFDRational(1), TiffImagePlugin.IFDRational(0), TiffImagePlugin.IFDRational(0)), 3: 'E', 4: (TiffImagePlugin.IFDRational(2), TiffImagePlugin.IFDRational(0), TiffImagePlugin.IFDRational(0))}
    return exif
profile_bytes = bytearray(ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes())
profile_bytes[24:36] = struct.pack('>6H', 2026, 10, 19, 0, 0, 0)
profile = bytes(profile_bytes)
image.convert('CMYK').save(root / 'metadata-cmyk.jpg', exif=make_exif(), quality=90)
image.convert('RGB').save(root / 'metadata.jpg', exif=make_exif(), icc_profile=profile, quality=90, progressive=True)
info = PngImagePlugin.PngInfo()
info.add_text('Description', 'PUBLIC-FIXTURE-PNG-TEXT')
info.add_text('Comment', 'PUBLIC-FIXTURE-COMPRESSED', zip=True)
info.add_itxt('XML:com.adobe.xmp', '<x:xmpmeta>PUBLIC-FIXTURE-XMP</x:xmpmeta>', zip=True)
image.save(root / 'metadata.png', exif=make_exif(), pnginfo=info, icc_profile=profile)
image.save(root / 'metadata.webp', exif=make_exif(), icc_profile=profile, xmp=b'<x:xmpmeta>PUBLIC-FIXTURE-XMP</x:xmpmeta>', lossless=True)
image.save(root / 'metadata.tiff', tiffinfo={271: 'PUBLIC-FIXTURE-CAMERA', 315: 'Public fixture artist', 274: 6})
image.convert('RGB').save(root / 'metadata.avif', exif=make_exif(), quality=90)
second = Image.new('RGBA', (48, 32), (20, 150, 90, 160))
image.save(root / 'animated.webp', save_all=True, append_images=[second], duration=[100, 200], loop=0, exif=make_exif(), xmp=b'PUBLIC-FIXTURE-XMP', lossless=True)
for size in [16, 32, 256]:
    image.resize((size, size)).save(root / f'icon-{size}.png')
print('Generated original public fixtures:', ', '.join(p.name for p in root.iterdir()))
