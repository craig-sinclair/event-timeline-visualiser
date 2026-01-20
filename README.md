# Event Timeline Visualiser
#### Table of Contents
- [About](#about)
- [Usage](#usage)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Local Installation Guide](#local-installation-guide)
- [Directory Structure](#directory-structure)
- [CI/CD](#cicd)

## About
![Site Banner Image](src/data/screenshots/header.png)
The **Event Timeline Visualiser** is an interactive web-application that allows users to explore a variety of political/economic/social timelines via an intuitive user interface.
Timelines consists of a variety of events, which include: political statements, news events, ecnomic policy changes, and much more! This project aims to promote a bias-free reporting of factual events, allowing users to explore events in the world of current affairs in an accessible manner. To explore the capabilities of the Event Timeline Visualiser, see the [features](#features) section.

## Usage
The Event Timeline Visualiser application publicly accessible at [event-timeline-visualiser.vercel.app/](https://event-timeline-visualiser.vercel.app/). If you wish to run a local version of the application, please see the dedicated [guide](#local-installation-guide).

## Features
Beyond the landing page, users are redirected to the home dashboard, which contains a table of all explorable timelines in the application:
![Dashbord of Available Timelines](src/data/screenshots/table-dashboard.png)

There are a variety of available formats for viewing timelines, and the application aims to automatically determine the most appropriate view depending on the context of a particular timeline. These include:
1) Standard horizontal format timelines:
![Horizontal Timeline View](src/data/screenshots/horizontal.png)

2) Standard vertical format timelines:
![Vertical Timeline View](src/data/screenshots/vertical.png)

3) Two-sided timeline:
![Two-Sided Timeline View](src/data/screenshots/two-sided.png)

3) Continuous/gradient scale timelines (communicating each event's position within the timeline):
![Continuous/Gradient Scale Timeline View](src/data/screenshots/continuous.png)

4) Comparison view, allowing the grouping of multiple timelines for similar issues:
![Comparison Timeline View](src/data/screenshots/comparison.png)

Note that in all cases, the timeline pages are equipped with a suite of helpful **filters** based on the content of events. This allows users to customise their view and explore topics most interesting to them.
Users may click on individual events, which displays a helpful pop-up with more information, sources, and topics related to that particular event.


## Technology Stack
- **MongoDB** serves as the application's database, with backend interaction utilising the [Mongoose]("https://mongoosejs.com/") object modelling tool.
- **NextJS** utilised as a full-stack framework, with [React]("https://react.dev/") as the web-library.
- **TypeScript** programming language used throughout the application.


## Local Installation Guide
```bash
# Open a terminal and clone the repository
git clone https://github.com/craig-sinclair/event-timeline-visualiser.git
```

> [!IMPORTANT]
> Environmetal variables are required for setup to allow for MongoDB interaction. For reference, a `.env.example` file has been created at the project root. Developers should create a `.env` file following this example, and update the `MONGODB_URI` to their own connection string.

`npm` was utilised as a package manager tool in this project. To install dependencies, from the project root folder `event-timeline-visualiser`:
```bash
# From the project root folder (event-timeline-visualiser)

# Install project dependencies with npm
npm install

# Use the provided datbase population script for sample data
npm run populate-data

# Run the development serve
npm run dev
```
The site shall then be accessible at [http://localhost:3000](http://localhost:3000).

## Directory structure
Following NextJS convention, routing to frontend pages and API endpoints is based upon the folder structure in the `src/app/` directory.

```
src/
  app/                        # Next.js routes (App Router)
    layout.tsx
    page.tsx
    dashboard/                # Displays all available timelines in a table format
      page.tsx
    events-in-topic/          # View all events with a particular ontology topic (across all timelines)
      [topicID]/
        page.tsx
    signin/                   # Sign-in form page
      page.tsx
    signup/                   # Profile registration page
      page.tsx
    profile/                  # View profile (signed in users only)
      page.tsx
    timeline/                 # View a specific timeline, defaulting to an appropriate view/style for event display
      [timelineID]/
        page.tsx

    api/                      # ONLY route handlers here (Next.js conventions)
      /admin              
        / users               # Fetch all users from database
          / route.ts
      /auth                   # Various routes for login, registration, fetching auth session
        ...
      /fetch-events           # Fetch all events in a given timeline
        /[timelineID]
          /route.ts
      /fetch-tmieline         # Fetch a timeline object by its ID
        /[timelineID]
          /route.ts
      /fetch-timelines        # Fetch all timelines in the DB
        /route.ts
      
      /fetch-topic-hierarchy  # Builds array of parent/grandparent/... topics from a given media (ontology) topic
        /[topicID]
          / route.ts

  components/
    ui/                       # Reusable UI primitives

    layout/                     # Page or app-level layout components
      ErrorBoundary.tsx

    modals/                     # modals/ pop-ups
      EventModal.tsx            # Event card with further information on specific event
      ExportTimelineModal.tsx   # Modal to handle exporting of timeline in HTML or image format

    CompareTimelines.tsx          # Allow grouped display of all events in multiple timelines
    ContinuousScaleTimeline.tsx   # Gradient format scale encoding position in timeline display
    HorizontalTimeline.tsx        # Standard horizontal format timeline of events
    VerticalTimeline.tsx          # Standard vertical format timeline of events
    TimelinesTable.tsx            # Table to list all events

  lib/                        # Framework-agnostic helpers (formatters, API clients) and general-purpose utilities
    createEventCardStyle.ts       # Determine event card styling based on its relevance
    exportTimelineHTML.ts         # Exporting of timeline as HTML file
    exportTimelineImage.ts        # Exporting of timeline as PNG file
    filterEvents.ts               # Filter event array by tags, date range and relevance
    getAllTagsInTimeline.ts       # Returns all tags that exist in events in a timeline
    getAllYearsInTimeline.ts      # Gets all years (dates) in events in a timeline
    getEventColour.ts             # Determine event card colour corresponding to gradient scale for position
    mongoose.ts                   # Allow global connection to MongoDB through mongoose package
    sortEvents.ts                 # Re-arrange array of event by input sorting field
    api/                      # Helper functions to communicate with API endpoints via frontend
      getAllTimelines.ts
      getEventsInTimeline.ts
      getEventsInTopic.ts
      getTimelineFromId.ts
      getTopicHierarchy.ts

  models/                     # TypeScript types/interfaces and schemas/models for MongoDB
    api.ts                      # Contains base types for API responses/failures
    event.ts
    ontology.ts
    timeline.ts
    user.ts


  services/                   # Business logic for auth login
    authService.ts
    passwordService.ts

  hooks/                      # Custom React hooks
    useEventModal.ts            # Contains shared general logic for opening/closing event card and viewing its contents
    useTimelineComparisonData.ts

  utils/                      # Miscellaneous utilities
    event-styles.const.ts       # Stores base styling logic for event cards

  public/                     # Static assets

  data/                       # JSON format data for population script and screenshots
    /screenshots
    sample-timelines.json     # JSON document for timelines collection
    sample-covid-data.json    # Example of JSON document for events in a timeline

  __tests__/                  # Unit tests folder
```

## CI/CD

### Continuous Integration
The `.github/workflows/ci.yml` file specifies a CI pipeline to execute on each commit to the repository. This consists of a single job with four key phases:
1) Installation of project dependencies.
2) **Linting**: see more information on project styles and conventions this phase enforces [here](#code-styling-and-conventions).
3) **Unit test**: see more information on project unit testing [here](#unit-testing)
4) **Build**: which converts the project code into a production-ready build of the application.

### Continuous Deployment
The `main` branch on this repository automatically deploys to Vercel with new commits. Due to this, future contributions should ensure robust evaluation of code additions prior to committing changes to the main branch to avoid disruptions to the deployed environment. See more information on project conventions for branching and merge requests [here](#branching-strategy).
Production credentials are stored on GitHub under the repository secrets. Importantly, this includes the `MONGODB_URI` which links to the hosted MongoDB databse, via [Atlas Database](https://www.mongodb.com/products/platform/atlas-database).


### Branching Strategy
This application makes use of the [feature branching](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) strategy. All new code contributions (bug fixes, new features, refactoring, etc) should be committed to a branch created from an issue on the GitHub repository. When changes are ready to enter the production environment, a merge request should be raised from the feature branch (branch created from an issue) into the `main` branch.
Before merging, the pipeline must have completed a successful run on the merge request before being changes are allowed to be merged onto the `main` branch. This serves as a protection method for the deployed environment 

### Code Styling and Conventions
- Code styles and conventions are enforced throughout the project, and are specified in `eslint.config.mjs`.
- This enforces: double quotes for strings, trailing commas in objects, four tab style indentation/spacing, wrapping lines over one hundred characters, ... etc.
- Running `npm run lint` locally in a terminal shall execute the linter tool. Enable automating fixing of lint issues (where possible), with `npm run lint:fix`.

### Unit Testing
- The [Vitest](https://vitest.dev/) testing framework was used for all unit tests.
- The `__tests__/` directory aims to mirror the `src/` directory, with an emphasis on testing for API routes and `lib/` functions.
- Running `npm run test` locally in a terminal shall execute all unit tests in the `__test__/` directory.
- Frequently, interactions with the database are mocked. This is to ensure an isolated testing environment and to avoid unwanted changes to records.

Add: package used for unit testing, patterns of unit testing, automated runs, local triggering of unit testing, importance of testing (particular lib functions + api routes).

### Pre-Commit Hooks
After cloning the repository, and running `npm install`, this shall enable pre-commit hooks via the Husky package.
Currently, this executes the lint stage prior to all Git commits made, blocking if there are any lint errors.