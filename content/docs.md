# Developer Documentation
Welcome to the **Timeline Scope** API. This reference covers everything you need to integrate with the platform: querying events, timelines, and media topics.

## Base URL
All API requests are made to:
```
https://event-timeline-visualiser.vercel.app/api
```

## Getting Started
The API is built on standard HTTP and returns JSON for all responses. No SDK required; any HTTP client will work.

A basic request looks like this:
```bash
curl https://event-timeline-visualiser.vercel.app/api/api/fetch-timelines
```