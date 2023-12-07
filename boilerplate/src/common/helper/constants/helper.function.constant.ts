import ms from 'ms';
import * as turf from '@turf/turf';

export function seconds(msValue: string): number {
    return ms(msValue) / 1000;
}

export const pointInPoly = (
    point: { Longitude: number; Latitude: number },
    coordinates,
    type = 'Polygon',
) => {
    let isPointInPoly = true;
    const { Longitude, Latitude } = point;
    const pt = turf.point([Longitude, Latitude]);
    if (type == 'Polygon') {
        const poly = turf.polygon(coordinates);
        isPointInPoly = turf.booleanPointInPolygon(pt, poly);
    } else {
        const poly = turf.multiPolygon(coordinates);
        isPointInPoly = turf.booleanPointInPolygon(pt, poly);
    }

    return isPointInPoly;
};
