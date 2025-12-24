import * as v from 'valibot';
import { query } from '$app/server';

const fetchStop = query(v.string(), async (stopPlaceId: string) => {
	const stopPlaceQuery = `{
        stopPlace(id: "NSR:StopPlace:${stopPlaceId}") {
            name(language: "nb")
            estimatedCalls(numberOfDeparturesPerLineAndDestinationDisplay: 10) {
                expectedDepartureTime
                destinationDisplay {
                    frontText
                }
                quay {
                    stopPlace {
                        transportMode
                    }
                }
            }
        }
    }`;

	const stopPlaceData = await fetch('https://api.entur.io/journey-planner/v3/graphql', {
		method: 'POST',
		headers: {
			// Replace this with your own client name:
			'ET-Client-Name': 'vha-smart-mirror',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query: stopPlaceQuery })
	}).then((res) => {
		if (!res.ok) {
			throw new Error('Network response was not ok', { cause: res });
		} else {
			return res.json();
		}
	});
	return stopPlaceData;
});

export { fetchStop };
