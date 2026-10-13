# Creative Team Production portfolio

A fast, responsive one-page portfolio for creator-led reels, product films, and short-form brand content. It uses plain HTML, CSS, and JavaScript—no build step or runtime dependencies.

## Run locally

From the project folder:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173` (or use the live preview in Arena).

## Before publishing

1. Open `js/site-config.js` and confirm the public brand name, Instagram profile, and short brand name.
2. Add the creator’s WhatsApp number to `whatsappNumber` using digits only, with country code (for example `919876543210`). The booking form then opens WhatsApp with the client’s details pre-filled. The website does not store submissions.
3. Replace the placeholder images in `images/`—including the creator studio photo—with your own behind-the-scenes shots and approved client work. The sample campaign frames are labelled as concepts, not past client projects.
4. Add any other verified contact details, service area, rates, or availability before launch.

WhatsApp booking is configured for the provided number with India’s `91` country code. Instagram links are pointed to `@creative_team_production_`.
