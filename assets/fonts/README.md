# Proxima Nova Font Directory

Place your licensed Proxima Nova font files in this directory:
- `ProximaNova-Regular.otf` (or `.ttf`)
- `ProximaNova-Medium.otf` (or `.ttf`)
- `ProximaNova-Semibold.otf` (or `.ttf`)
- `ProximaNova-Bold.otf` (or `.ttf`)
- `ProximaNova-Extrabld.otf` (or `.ttf`)

The font loader in `src/constants/typography.ts` is pre-configured to automatically load these files when present, falling back smoothly to the platform sans-serif + Tamil system font stack (`-apple-system`, `Roboto`, `Tamil Sangam MN`, `Noto Sans Tamil`) to prevent layout shifts.
