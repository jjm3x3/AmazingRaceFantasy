# X Factor League

X Factor League provides a space to create fantasy leagues for reality game shows. Currently, we support Amazing Race and Big Brother, with Survivor being in the works. The site runs on NextJS, React, and Redis, reading data from the relevant Wikipedia pages.

## Table of Contents
1.[Getting Started](#getting-started)
1.[Commands](#commands)
1.[Seeding the Database](#seeding-db)

## Getting Started
<a name="getting-started"></a>

We have two key phrases that we use throughout the app:
1. **Competing Entity**: This is used for any competitor (individual or teams) in a show
1. **Contestant**: This is used for any competitor in a league

This app requires setting a local environment variable. Here's how to set up this variable: 
1. Generate a local secret key. One way to do this is to run `openssl rand -base64 32`
1. In your `.env.development.local`, create a variable named `SESSION_SECRET`
1. Set this variable equal to the value you generated in step 1.
1. Stop and start your app.

### Commands
<a name="commands"></a>
- `npm run dev`: Runs the development server. The development URL is [http://localhost:3000](http://localhost:3000).
- `npm run seed:dev`: Seeds the Redis development database. You will need development credentials. Ask [@jjm3x3] (https://github.com/jjm3x3) for help. Read [seeding the db](#seeding-the-db) for more information.
- `npm run seed:prod`: Seeds the Redis production database. You will need production credentials. Ask [@jjm3x3] (https://github.com/jjm3x3) for help. Read [seeding the db](#seeding-the-db) for more information.
- `npm run test`: Runs the unit tests for the app. These tests are written in Jest.
- `npm run lint`: Runs our linter, built in ESLint. If you want to autofix the problems, run `npm run lint:fix`.


### [Seeding The DB](#seeding-the-db)
<a name="seeding-db"></a>

Since we do not have authentication or authorization on the site for now, all data stored in the backend has been stored in source [see leagueData](https://github.com/jjm3x3/AmazingRaceFantasy/tree/main/app/leagueData) and in our database. We have created two new npm stages under the ["scripts" section of package.json](https://docs.npmjs.com/cli/v7/using-npm/scripts). They are `seed:dev` and `seed:prod`, which will run the [seedDb script](https://github.com/jjm3x3/AmazingRaceFantasy/blob/main/scripts/seedDb.mjs).

#### How to run

1. Put secrets in appropriate `.env*` file.
    - _If you are authenticated to Vercel and have the vercel CLI installed_
       - Run `vercel env pull` in order to setup the build.
       - Run `vercel env pull .env.development.local` in order to setup to run the `seed:dev` command.
       - Run `vercel env pull --environment production .env.production.local` in order to setup to run the `seed:prod` command.
    - _If you are not authenticated_
        - Get in touch with [@jjm3x3](https://github.com/jjm3x3) in order to arrange some credential exchange
1. Run either `seed:dev` or `seed:prod` depending which you need. 
    1. These have different credentials. Make sure you have the appropriate ones.
    1. Make sure you seed prod before you deploy updated code to prod.
