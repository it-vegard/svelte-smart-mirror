import * as v from 'valibot';
import { query } from '$app/server';
import {
	PUBLIC_ENTUR_API_CLIENT_NAME,
	PUBLIC_ENTUR_IGNORED_LINES,
	PUBLIC_ENTUR_NUMBER_OF_DEPARTURES,
	PUBLIC_LANGUAGE
} from '$env/static/public';

const language = PUBLIC_LANGUAGE || 'nb';
const numberOfDepartures = parseInt(PUBLIC_ENTUR_NUMBER_OF_DEPARTURES) || 10;

const fetchStop = query(v.string(), async (stopPlaceId: string) => {
	const stopPlaceQuery = `{
        stopPlace(id: "NSR:StopPlace:${stopPlaceId}") {
            name(language: "${language}")
            estimatedCalls(numberOfDepartures: ${numberOfDepartures}) {
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
			'ET-Client-Name': PUBLIC_ENTUR_API_CLIENT_NAME,
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
		.then(({ data }) => {
			const stopPlace = data.stopPlace;
			if (!stopPlace) {
				throw new Error('Stop place not found');
			}
			return {
				name: stopPlace.name,
				departures: stopPlace.estimatedCalls
					.filter(
						(call: { destinationDisplay: { frontText: string } }) =>
							!PUBLIC_ENTUR_IGNORED_LINES.split(',').includes(call.destinationDisplay.frontText)
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
