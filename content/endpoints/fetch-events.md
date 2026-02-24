# Fetch Events by Timeline

Base path: `/api/fetch-events/<timeline-id>`

---

## GET /api/fetch-events/[timelineID]
Returns all events belonging to a specific timeline, resolved from the timeline's event ID array.

**Authentication**: Required

**Path Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timelineID` | string | Yes | MongoDB ObjectId of the parent timeline |

**Example Request**
```bash
curl https://event-timeline-visualiser.vercel.app/api/fetch-events/<timeline-id> \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response (Success)**
```json
{
  "success": true,
  "message": "Successfully fetched events for timeline 123",
  "events": [
    {
      "_id": "001",
      "overview": "Massachusetts v. EPA (U.S. Supreme Court)",
      "dateTime": "2007-04-02",
      "relevance": 0.96,
      "furtherDescription": "The Supreme Court held that greenhouse gases fit within the Clean Air Act's broad definition of air pollutants...",
      "URLs": [
        "https://example1.com"
      ],
      "tags": [],
      "position": 0.7,
      "qcode": [
        "11000001",
        "11000005"
      ]
    },
    {
      "_id": "002",
      "overview": "Clinton Administration delays on SUV fuel efficiency standards",
      "dateTime": "1999-07-01",
      "relevance": 0.7,
      "furtherDescription": "Despite growing concern over fuel economy, the Clinton administration allowed CAFE standards to remain flat...",
      "URLs": [
        "https://example2.com"
      ],
      "tags": [],
      "position": 0.35,
      "qcode": [
        "12000000",
        "14000000"
      ]
    }
  ],
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Example Response (Error)**
```json
{
  "success": false,
  "error": "Failed to retrieve events from database",
  "details": "Could not find given timeline.",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Response Fields**
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded |
| `message` | string | Human-readable result message (success only) |
| `events` | array | List of event objects belonging to the timeline |
| `events[]._id` | string | Unique MongoDB ObjectId as string |
| `events[].overview` | string | Short title or summary of the event |
| `events[].dateTime` | string | ISO 8601 date of the event |
| `events[].relevance` | number | Relevance score from 0 to 1 |
| `events[].furtherDescription` | string | Full descriptive text of the event |
| `events[].URLs` | array | List of source URLs for the event |
| `events[].tags` | array | List of tags associated with the event |
| `events[].position` | number | Position on continuous scale timelines from 0 to 1 (optional) |
| `events[].side` | number | Position on binary two-sided timeline (0 or 1) (optional) |
| `events[].qcode` | array | List of IPTC media topics (qcodes) categorising the event |
| `error` | string | Error summary (failure only) |
| `details` | string | Detailed error message (failure only) |
| `timestamp` | string | ISO 8601 timestamp of the response |

**Response Codes**
| Status | Description |
|--------|-------------|
| `200` | Events successfully retrieved |
| `401` | Missing or invalid authentication token |
| `500` | Timeline not found or database failure |