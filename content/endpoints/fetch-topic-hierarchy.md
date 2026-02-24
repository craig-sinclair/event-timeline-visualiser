# Fetch Topic Hierarchy
Base path: `/api/fetch-topic-hierarchy/[topicID]`

---

## GET /api/fetch-topic-hierarchy/[topicID]
Returns a single IPTC media topic along with its full parent hierarchy, traversed upward through the ontology until the root topic is reached.

**Authentication**: Required

**Path Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topicID` | string | Yes | IPTC qcode (without `medtop:` prefix) to query |

**Example Request**
```bash
curl https://event-timeline-visualiser.vercel.app/api/fetch-topic-hierarchy/11000001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response (Success)**
```json
{
  "success": true,
  "message": "Successfully fetched topic hierarchy data from database",
  "topic": {
    "qcode": "11000001",
    "prefLabel": "environmental policy",
    "hierarchy": [
      {
        "qcode": "11000000",
        "prefLabel": "politics"
      },
      {
        "qcode": "11000000",
        "prefLabel": "social issue"
      }
    ]
  },
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Example Response (Error)**
```json
{
  "success": false,
  "error": "Failed to retrieve topic hierarchy data from database",
  "details": "Could not find topic with ID: 99999999.",
  "timestamp": "2026-02-24T12:00:00.000Z"
}
```

**Response Fields**
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded |
| `message` | string | Human-readable result message (success only) |
| `topic` | object | The resolved topic with its hierarchy (success only) |
| `topic.qcode` | string | IPTC qcode of the queried topic (`medtop:` prefix stripped) |
| `topic.prefLabel` | string | Human-readable label of the queried topic |
| `topic.hierarchy` | array | Ordered list of parent topics from immediate parent to root |
| `topic.hierarchy[].qcode` | string | IPTC qcode of the parent topic (`medtop:` prefix stripped) |
| `topic.hierarchy[].prefLabel` | string | Human-readable label of the parent topic |
| `error` | string | Error summary (failure only) |
| `details` | string | Detailed error message (failure only) |
| `timestamp` | string | ISO 8601 timestamp of the response |

**Notes**
- The `hierarchy` array is ordered from the immediate parent of the queried topic up to the root, e.g. `[parent, grandparent, root]`.
- If the queried topic is already a root topic with no parent, `hierarchy` will be an empty array.
- The `topicID` should be provided without the `medtop:` prefix.

**Response Codes**
| Status | Description |
|--------|-------------|
| `200` | Topic hierarchy successfully retrieved |
| `401` | Missing or invalid authentication token |
| `500` | Topic not found or database failure |