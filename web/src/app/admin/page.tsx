'use client'

import { useMap } from "@/hooks/useMap"
import { socket } from "@/utils/socket-io"
import { RefObject, useEffect, useRef } from "react"
import { ServerNewPointsResponseProps } from "../driver/MapDriver"

export default function Admin() {
	const mapContainerRef = useRef<HTMLDivElement>(null)

	const map = useMap(mapContainerRef as RefObject<HTMLDivElement>)

	useEffect(() => {
			if(!map) {
				return
			}
	
			if(socket.disconnected) {
				socket.connect()
			} else {
				socket.offAny()
			}
	
			socket.on(`server:new-points:list`, async (data: ServerNewPointsResponseProps) => {
				const { route_id, lat, lng } = data
			
				if(!map.hasRoute(route_id)) {
					const response = await fetch(`http://localhost:3000/routes/${data.route_id}`)

					const route = await response.json()

					const { start_location, end_location } = route.directions.routes[0].legs[0]

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
		}, [map])

	return (
		<div className="w-screen h-screen" ref={mapContainerRef}></div>
	)
}