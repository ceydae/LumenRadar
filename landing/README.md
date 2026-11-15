# LumenRadar landing

The application source lives in `../apps/landing`. This directory forwards npm
commands there so the original launch path continues to work.

```powershell
npm install
npm run dev
```

Open http://127.0.0.1:3050/ (the browser opens automatically).
`npm start` also starts development. Run `npm run build` followed by
`npm run preview` to preview a production build.

Development and preview both use port 3050. Stop one before running the other.
If that port is occupied, Vite reports the conflict instead of silently
switching ports. Keep the terminal running while using the site.
