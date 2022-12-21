import * as React from 'react';
import { Layer, Source } from 'react-map-gl';

export const Line = (props) => {
    return (
        <Source key={Math.random()} id="pointLayer" type="geojson" data={props.data}>
            <Layer
                key={Math.random()}
                id={"symbolLayer" + Math.random()}
                type="symbol"
                source="my-data"
                layout={{
                    "text-field": props.prev.length > 0 ? props.x.toFixed(2) + "        Kms" : "0.00     Kms"
                }}
                paint={{
                    "icon-color": "black"
                }}
            ></Layer>
        </Source>
    )
}