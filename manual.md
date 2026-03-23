# TimelineScope User Manual

## Getting Started
TimelineScope is publicly accessible at https://event-timeline-visualiser.vercel.app/. Users who wish to create a local build can follow the below steps.

#### Pre-Requisites
- **Node.js** installed: download from [nodejs.org](https://nodejs.org/en).
- A **MongoDB** instance accessible via a connection URI (e.g. `mongodb://localhost:27017/yourdb`). If required, see the [MongoDB installation guide](https://www.mongodb.com/docs/manual/installation/).
- **Git** installed on your local machine: download from [git](https://git-scm.com/).

```bash
# Open a terminal and clone the repository
git clone https://github.com/craig-sinclair/event-timeline-visualiser.git
```

> [!IMPORTANT]
> Environmetal variables are required for setup to allow for MongoDB interaction. For reference, a `.env.example` file has been created at the project root. Developers should create a `.env` file following this example, and update the `MONGODB_URI` to their own connection string.

`pnpm` was utilised as a package manager tool in this project. To install dependencies, from the project root folder `event-timeline-visualiser`:
```bash
# From the project root folder (event-timeline-visualiser)

# Install pnpm package manager with npm (if required)
npm install pnpm

# Install project dependencies with npm
pnpm install

# Use the provided database population script for sample data
pnpm run populate-data

# Run the development serve
pnpm run dev
```
The site shall then be accessible at [http://localhost:3000](http://localhost:3000).

### Navigating the App
1) The initial landing page provides an about section, accessible by clicking the arrow with "Learn More" text at the bottom of the page. This details some helpful introductory information regarding TimelineScope.
2) From here, select "All Timelines" in the centre of the navigation bar, or one of the buttons on the about section titled "Explore Timelines" or "View All Timelines".
3) This page includes a table view of all available timelines in the application.
There are a variety of available formats for viewing timelines, and the application aims to automatically determine the most appropriate view depending on the context of a particular timeline. These include: horizontal, vertical, two-sided and continuous/gradient scale timelines.
4) Select the COVID-19 Pandemic timeline, this defaults to a horizontal-format visualisation of the timeline events (this can be toggled via the display mode option on the top right of the page to a vertical format).
5) Regardless of the visualisation format, events are chronologically presented in the timeline. Clicking on an individual event displays an event card detailing further information regarding this event.
6) Events that are more relevant within the timeline appear visually larger (in the size of their box and text).
7) Within this event card, its categorised media topics are detailed, along with their hierarchical structure within the ontology. Selecting an individual media topic presents a visualisation page including all events across all timelines that share this media topic, or one of its descendants.
8) Further visualisation options in timelines are viewable (after returning to "All Timelines" page). For example, the *Brexit Campaign* evidences a two-sided timeline, where events are placed either on the Remain side (right of the timeline) or the Leave side (left of the timeline). Furthermore, the *UK Response to Climate Change* timeline showcases a continuous scale visualisation. Events are positioned along a gradient-scale of positions depending on their perspectives, with two endpoints provided by labels.

### Filtering Events
1) Within an individual timeline a variety of filtering (and sorting) options are available. The UI presents these above the events within all timeline formats.
2) The date range option allows you to filter events based upon a date range of focus. Its drop-down options are automatically populated to include all years (and months within those years), which you can focus visualisation on; depending on when events in the timeline occurred. This option defaults to "All Time" which includes all events.
3) The media topics option allows for filtering events such that only those which have been categorised by selected media topic(s) are selected. This is a multi-select drop-down, which is also searchable. You can also press the small "X" within the drop-down container to clear all media topics selected. Options are automatically populated with all media topics that are present throughout events within the timeline.
4) The min. relevance option allows filtering of events by their relevance scores. This is a "slider" option where you can drag the blue circle to the left/right to decrease/increase the minimum relevance required for an event to be included in the visualisation.
5) The sort by option allows modification of the ordering in which events are presented within the page. The available options for sorting are: chronological (default), relevance (low-high), relevance (high-low), and newest first.

### Exporting Timelines
All timelines can be exported into an image (PNG) format, or as a HTML document.
1) Whilst viewing a timeline, select the "Export Timeline" button, which appears under the filters.
2) Select either "Export as Image" or "Export as HTML".
3) In both cases, the generated file shall immediately download within your browser. The file itself is timestamped for future reference, and includes the complete event sequence in its content.

### Account Creation and Authorisation
1) To create an account, firstly navigate to the sign in page, accessible via the "Sign In" button on the top-right of the navigation bar.
2) Under the sign-in form, click the registration link with text "Haven't created an account yet? Register here".
3) Complete the sign-up form, providing an e-mail, display name, and password (must contain 6 characters, an uppercase letter and a digit).
4) The application will automatically sign you in, and re-direct you towards the timelines dashboard page. You can login with your created credentials upon subsequent visits to TimelineScope.

### Developer Documentation
1) Logged-in users only can access the developer documentation through selecting the "Developers" tab in the navigation bar.
2)  This page provides an example CURL request, required path parameters, an example expected responses and possible status codes for each of the accessible API endpoints within the application.
3) Explore different endpoints accessible through the side-bar to the left of the documentation content.