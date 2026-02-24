# Fetch Timelines by Event Tags
Base path: `/api/fetch-timelines-in-event-tags`

---

## POST /api/fetch-timelines-in-event-tags
Accepts an array of timeline tag strings and returns a mapping of each tag to its corresponding timeline MongoDB ObjectId. Useful for fetching timelines that are related to a given event (from its `tags` field).

**Authentication**: Required

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tags` | array | Yes | List of timeline tag strings to resolve |

**Example Request**
```bash
curl -X POST https://event-timeline-visualiser.vercel.app/api/fetch-timelines-in-event-tags \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "tags": ["us-climate", "trump"] }'
```

**Example Response (Success)**
```json
{
  "success": true,
  "message": "Successfully fetched topic hierarchy data from database",
  "timelines": {
    "us-climate": "123",
    "trump": "456"
  },
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Example Response (Error)**
```json
{
  "success": false,
  "error": "Failed to retrieve timelines from event tags.",
  "details": "No valid tag data provided.",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Response Fields**
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded |
| `message` | string | Human-readable result message (success only) |
| `timelines` | object | Key-value map of tag string to timeline MongoDB ObjectId |
| `timelines[tag]` | string | MongoDB ObjectId of the timeline matching the given tag |
| `error` | string | Error summary (failure only) |
| `details` | string | Detailed error message (failure only) |
| `timestamp` | string | ISO 8601 timestamp of the response |


**Response Codes**
| Status | Description |
|--------|-------------|
| `200` | Timelines successfully resolved |
| `401` | Missing or invalid authentication token |
| `500` | Invalid input, no valid tags, or database failure |