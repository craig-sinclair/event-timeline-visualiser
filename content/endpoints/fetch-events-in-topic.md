# Fetch Events by Media Topic
Base path: `/api/fetch-events-in-topic/[topicID]`

---

## GET /api/fetch-events-in-topic/[topicID]
Returns all events across every timeline that are tagged with a given IPTC media topic. Child topics in the ontology hierarchy are automatically included; so querying a parent topic returns events from all its descendants too.

**Authentication**: Required

**Path Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topicID` | string | Yes | IPTC qcode (without `medtop:` prefix) to query |

**Example Request**
```bash
curl https://event-timeline-visualiser.vercel.app/api/fetch-events-in-topic/<qcode> \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response (Success)**
```json
{
  "success": true,
  "message": "Successfully fetched event data from topic ID",
  "events": [
    {
      "timelineId": "123",
      "timelineName": "US Response to Climate Change",
      "events": [
        {
          "_id": "001",
          "overview": "Massachusetts v. EPA (U.S. Supreme Court)",
          "dateTime": "2007-04-02",
          "relevance": 0.96,
          "furtherDescription": "The Supreme Court held that greenhouse gases fit within the Clean Air Act's broad definition of air pollutants...",
          "URLs": [
            "https://example.com"
          ],
          "tags": [],
          "position": 0.7,
          "qcode": ["11000001", "11000005"]
        }
      ]
    },
    {
      "timelineId": "345",
      "timelineName": "Donald Trump",
      "events": [
        {
          "_id": "002",
          "overview": "Paris Agreement Withdrawal Announced",
          "dateTime": "2017-06-01",
          "relevance": 0.91,
          "furtherDescription": "President Trump announced the United States would withdraw from the Paris Climate Agreement...",
          "URLs": [],
          "tags": [],
          "position": 0.2,
          "qcode": ["11000001"]
        }
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
  "details": "No timelines were found.",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Response Fields**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded |
| `message` | string | Human-readable result message (success only) |
| `events` | array | List of timeline groups containing matched events |
| `events[].timelineId` | string | MongoDB ObjectId of the parent timeline |
| `events[].timelineName` | string | Display title of the parent timeline |
| `events[].events` | array | All events in this timeline matching the topic |
| `events[].events[]._id` | string | Unique MongoDB ObjectId of the event |
| `events[].events[].overview` | string | Short title or summary of the event |
| `events[].events[].dateTime` | string | ISO 8601 date of the event |
| `events[].events[].relevance` | number | Relevance score from 0 to 1 |
| `events[].events[].furtherDescription` | string | Full descriptive text of the event |
| `events[].events[].URLs` | array | List of source URLs for the event |
| `events[].events[].tags` | array | List of tags associated with the event |
| `events[].events[].position` | number | Position on continuous scale timelines from 0 to 1 (optional) |
| `events[].events[].side` | number | Position on binary two-sided timeline (0 or 1) (optional) |
| `events[].events[].qcode` | array | IPTC qcodes assigned to the event |
| `error` | string | Error summary (failure only) |
| `details` | string | Detailed error message (failure only) |
| `timestamp` | string | ISO 8601 timestamp of the response |

**Notes**
- Child topics are resolved automatically via the ontology hierarchy. Querying a broad topic such as `11000000` will include events tagged with any of its descendants.
- Timelines with no matching events are excluded from the response entirely.

**Response Codes**

| Status | Description |
|--------|-------------|
| `200` | Events successfully retrieved |
| `401` | Missing or invalid authentication token |
| `500` | No timelines found or database failure |