# Fetch all Timelines
Base path: `/api/fetch-timelines`

---

## GET /api/fetch-timelines
Returns a list of all timelines stored in the database.

**Authentication**: Required

**Request Parameters**: N/A.

**Example Request**
```bash
curl https://event-timeline-visualiser.vercel.app/api/fetch-timelines \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response (Success)**
```json
{
  "success": true,
  "message": "Successfully fetched timelines from database",
  "timelines": [
    {
      "_id": "123",
      "title": "US Response to Climate Change",
      "shortName": "US",
      "events": [
        "000",
        "001"
      ],
      "discussionID": 999,
      "leftLabel": "Climate Skepticism",
      "rightLabel": "Climate Emergency Action",
      "continuousScale": true,
      "tag": "us-climate"
    },
    {
      "_id": "345",
      "title": "Donald Trump",
      "shortName": "Trump",
      "events": [
        "002",
        "003"
      ],
      "discussionID": 2468
    }
  ],
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Example Response (Error)**
```json
{
  "success": false,
  "error": "Failed to retrieve timelines from database",
  "details": "MongoNetworkError: connection timed out",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Response Fields**
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded |
| `message` | string | Human-readable result message (success only) |
| `timelines` | array | List of timeline objects (success only) |
| `timelines[]._id` | string | Unique MongoDB ObjectId as string |
| `timelines[].title` | string | Full display title of the timeline |
| `timelines[].shortName` | string | Abbreviated label used in the UI |
| `timelines[].events` | array | List of event ObjectIds belonging to this timeline |
| `timelines[].discussionID` | number | ID linking to the associated discussion thread |
| `timelines[].leftLabel` | string | Label for the left end of the scale (optional) |
| `timelines[].rightLabel` | string | Label for the right end of the scale (optional) |
| `timelines[].continuousScale` | boolean | Whether the timeline uses a continuous scale (optional) |
| `timelines[].tag` | string | URL-friendly identifier for the timeline (optional) |
| `error` | string | Error summary (failure only) |
| `details` | string | Detailed error message (failure only) |
| `timestamp` | string | ISO 8601 timestamp of the response |

**Response Codes**
| Status | Description |
|--------|-------------|
| `200` | Timelines successfully retrieved |
| `401` | Missing or invalid authentication token |
| `500` | Database connection or query failure |