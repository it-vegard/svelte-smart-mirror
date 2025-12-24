import * as v from 'valibot';
import { query } from '$app/server';

const fetchStop = query(v.string(), async (stopPlaceId: string) => {
	const stopPlaceQuery = `{
        stopPlace(id: "NSR:StopPlace:${stopPlaceId}") {
            name(language: "nb")
            estimatedCalls(numberOfDepartures: 10) {
                expectedDepartureTime
                destinationDisplay {
                    frontText
                }
                quay {
                    stopPlace {
                        transportMode
                    }
                }
				serviceJourney {
					line {
						publicCode
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
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error('Network response was not ok', { cause: res });
			} else {
				return res.json();
			}
		})
		.then((data) => {
			const stopPlace = data.data.stopPlace;
			if (!stopPlace) {
				throw new Error('Stop place not found');
			}
			return {
				name: stopPlace.name,
				departures: stopPlace.estimatedCalls
					.filter(
						(call: { destinationDisplay: { frontText: string } }) =>
							!['Bergkrystallen', 'Mortensrud'].includes(call.destinationDisplay.frontText)
					)
					.map(
						(call: {
							expectedDepartureTime: string;
							destinationDisplay: { frontText: string };
							quay: { stopPlace: { transportMode: string } };
							serviceJourney: { line: { publicCode: string } };
						}) => {
							return {
								expectedDepartureTime: call.expectedDepartureTime,
								destination: call.destinationDisplay.frontText,
								transportMode: call.quay.stopPlace.transportMode[0],
								lineNumber: call.serviceJourney.line.publicCode
							};
						}
					)
			};
		});
	return stopPlaceData;
});

export { fetchStop };
