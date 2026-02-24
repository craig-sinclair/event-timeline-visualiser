# Fetch Media Topics by Timeline
Base path: `/api/fetch-all-topics-in-timeline/[timelineID]`

---

## GET /api/fetch-all-topics-in-timeline/[timelineID]
Returns all unique IPTC media topic labels associated with a timeline, resolved from the qcodes present across its events.

**Authentication**: Required

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timelineID` | string | Yes | MongoDB ObjectId of the parent timeline |

**Example Request**
```bash
curl https://event-timeline-visualiser.vercel.app/api/fetch-all-topics-in-timeline/<timeline-id> \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response (Success)**
```json
{
  "success": true,
  "message": "Successfully fetched topics for timeline 699460429ee0817db37f2c7b",
  "topics": [
    {
      "qcode": "11000001",
      "prefLabel": "environmental policy"
    },
    {
      "qcode": "11000005",
      "prefLabel": "legislation"
    },
    {
      "qcode": "14000000",
      "prefLabel": "social issue"
    }
  ],
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Example Response (Error)**
```json
{
  "success": false,
  "error": "Failed to retrieve topics from database",
  "details": "Could not find given timeline.",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Response Fields**
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded |
| `message` | string | Human-readable result message (success only) |
| `topics` | array | List of unique IPTC media topic labels found across all events in the timeline |
| `topics[].qcode` | string | IPTC qcode identifier (numeric string, `medtop:` prefix stripped) |
| `topics[].prefLabel` | string | Human-readable IPTC media topic label |
| `error` | string | Error summary (failure only) |
| `details` | string | Detailed error message (failure only) |
| `timestamp` | string | ISO 8601 timestamp of the response |

**Notes**
- Only qcodes present on at least one event within the timeline are returned (this is not the full IPTC ontology).
- Duplicate qcodes across events are removed; only unique media topics are returned.
- The `medtop:` prefix is stripped from all returned qcodes for brevity.

**Response Codes**
| Status | Description |
|--------|-------------|
| `200` | Topics successfully retrieved |
| `401` | Missing or invalid authentication token |
| `500` | Timeline not found or database failure |