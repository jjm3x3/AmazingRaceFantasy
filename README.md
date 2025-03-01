This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Run `npm run dev` to run the development server

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Operations

### Seeding The DB

Since we do not have authentication or authorization on the site for now, all data stored in the backend has been stored in source [see leagueData](https://github.com/jjm3x3/AmazingRaceFantasy/tree/main/app/leagueData). In order to transition to a DB backend, we have created two new npm stages under the ["scripts" section of package.json](https://docs.npmjs.com/cli/v7/using-npm/scripts). The are `seed:dev` and `seed:prod`, which will run the [seedDb script](https://github.com/jjm3x3/AmazingRaceFantasy/blob/main/scripts/seedDb.mjs).

#### How to run

