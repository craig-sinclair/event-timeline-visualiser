# Fetch Timeline by ID
Base path: `/api/timelines/[timelineID]`

---

## GET /api/timelines/[timelineID]
Returns a single timeline by its MongoDB ObjectId.

**Authentication**: Required

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timelineID` | string | Yes | MongoDB ObjectId of the timeline to retrieve |

**Example Request**
```bash
curl https://event-timeline-visualiser.vercel.app/api/timelines/<timeline-id> \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response (Success)**
```json
{
  "success": true,
  "message": "Successfully fetched timeline from database",
  "timelines": [
    {
      "_id": "699460429ee0817db37f2c7b",
      "title": "US Response to Climate Change",
      "shortName": "US",
      "events": [
        "699460429ee0817db37f2c52",
        "699460429ee0817db37f2c53"
      ],
      "discussionID": 999,
      "leftLabel": "Climate Skepticism",
      "rightLabel": "Climate Emergency Action",
      "continuousScale": true,
      "tag": "us-climate"
    }
  ],
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Example Response (Error)**
```json
{
  "success": false,
  "error": "Failed to retrieve timeline from database",
  "details": "Could not find given timeline.",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded |
| `message` | string | Human-readable result message (success only) |
| `timelines` | array | Single-item array containing the matched timeline |
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
| `200` | Timeline successfully retrieved |
| `401` | Missing or invalid authentication token |
| `500` | Timeline not found or database failure |