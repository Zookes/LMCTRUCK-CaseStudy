This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Production and analytics

- Production site: https://lmctruck-case-study.vercel.app/
- GitHub repository: https://github.com/Zookes/LMCTRUCK-CaseStudy
- Google Analytics 4 measurement ID: `G-4X8Z994TYM`

The site uses `GoogleAnalytics` from `@next/third-parties/google` in the shared App Router layout. In the GA4 web data stream, keep Enhanced measurement enabled, including the browser-history changes setting, so client-side navigation is tracked without adding duplicate manual page-view events.

Vercel is connected to GitHub. From this project directory, commit and push changes to deploy:

```bash
npm run build
git add src/app/layout.tsx README.md package.json package-lock.json
git commit -m "Add Google Analytics 4"
git push
```

After Vercel finishes deploying, use the GA4 web data stream's **Test** button to open the production URL. Interact with the page and navigate between routes if available, then check **Reports > Realtime** for the active user and page-view activity. A successful local build verifies the code compiles; it does not confirm that the live deployment is sending data until the Test view or Realtime report shows it.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
