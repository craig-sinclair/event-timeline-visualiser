import { EventData } from "@/app/models/event";

export const SAMPLE_EVENTS: EventData[] = [
  {
    "_id": "12345",
    "overview": "Vote Leave campaign claimed leaving the EU would save £350 million per week for the NHS.",
    "dateTime": "2016-06-01T10:00:00Z",
    "relevance": 0.95,
    "furtherDescription": "This figure was printed on the side of the Vote Leave campaign bus, becoming one of the most controversial claims.",
    "URLs": ["https://www.bbc.com/news/uk-politics-eu-referendum-36271589"],
    "tags": ["economic", "political"]
  },
  {
    "_id": "12346",
    "overview": "Remain campaign argued Brexit would cause an immediate economic shock.",
    "dateTime": "2016-05-23T09:30:00Z",
    "relevance": 0.88,
    "furtherDescription": "Chancellor George Osborne warned of a 'DIY recession' if Britain left the EU.",
    "URLs": ["https://www.theguardian.com/business/2016/may/23/eu-exit-diy-recession-osborne-warns"],
    "tags": ["economic", "political"]
  },
  {
    "_id": "12347",
    "overview": "Nigel Farage claimed Brexit would allow the UK to take back control of its borders.",
    "dateTime": "2016-04-15T12:00:00Z",
    "relevance": 0.9,
    "furtherDescription": "This was a central message of the Leave campaign, focusing heavily on immigration.",
    "URLs": ["https://www.independent.co.uk/news/uk/politics/eu-referendum-nigel-farage-borders-control-immigration-a6985061.html"],
    "tags": ["political", "social"]
  }
]