'use client'

import { ComponentProps, RefObject, useEffect, useRef } from "react"
import { useMap } from "@/hooks/useMap"
import { socket } from "@/utils/socket-io"

export type MapDriverProps = ComponentProps<'div'> & {
	route_id: string | null
	start_location: {
		lat: number
		lng: number
	} | null
	end_location: {
		lat: number
		lng: number
	} | null
}

type ServerNewPointsResponseProps = {
	route_id: string
	lat: number
	lng: number
}

export function MapDriver({ route_id, start_location, end_location, ...props }: MapDriverProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null)

	const map = useMap(mapContainerRef as RefObject<HTMLDivElement>)

	useEffect(() => {
		if(!map || !route_id || !start_location || !end_location) {
			return
		}

		if(socket.disconnected) {
			socket.connect()
		} else {
			socket.offAny()
		}

		socket.on('connect', () => {
			console.log('Socket conectado!!!!')

			socket.emit('client:new-points', { route_id })
		})

		socket.on(`server:new-points/${route_id}:list`, (data: ServerNewPointsResponseProps) => {
			const { route_id, lat, lng } = data
		
			if(!map.hasRoute(route_id)) {
				map.addRouteWithIcons({
					routeId: route_id,
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
			}

			map.moveCar(route_id, { lat, lng })
		})

		return () => {
			socket.disconnect()
		}
	}, [route_id, map, start_location, end_location])

	return (
		<div {...props} ref={mapContainerRef}></div>
	)
}