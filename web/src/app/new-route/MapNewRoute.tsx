'use client'

import { ComponentProps, RefObject, useEffect, useRef } from "react"
import { useMap } from "@/hooks/useMap"
import { DirectionsData } from "@/utils/models"

export type MapNewRouteProps = ComponentProps<'div'> & {
	directionsData: DirectionsData
}

export function MapNewRoute({ directionsData, ...props }: MapNewRouteProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null)

	const map = useMap(mapContainerRef as RefObject<HTMLDivElement>)

	useEffect(() => {
		if(!map || !directionsData) {
			return	
		}

		const { start_location, end_location } = directionsData.routes[0].legs[0]

		map.removeAllRoutes()
		
		map.addRouteWithIcons({
			routeId: '1',
			startMarkerOptions: {
				position: start_location
			},
			endMarkerOptions: {
				position: end_location
			},
			carMarkerOptions: {
				position: start_location
			}
		})

	}, [map, directionsData])

	return (
		<div {...props} ref={mapContainerRef}></div>
	)
}