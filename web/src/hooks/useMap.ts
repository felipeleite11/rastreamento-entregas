import { useEffect, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Map } from "../utils/map"
import { getCurrentPosition } from "../utils/geolocation"

export function useMap(containerRef: React.RefObject<HTMLDivElement>) {
	const [map, setMap] = useState<Map>()

	useEffect(() => {
		(async () => {
			const loader = new Loader({
				apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
				libraries: ["routes", "geometry", "marker"]
			})

			const [, , , position] = await Promise.all([
				loader.importLibrary("routes"),
				loader.importLibrary("geometry"),
				loader.importLibrary("marker"),
				getCurrentPosition({ enableHighAccuracy: true })
			])

			const map = new Map(containerRef.current!, {
				mapId: "22757ee206db7912", // theme id
				zoom: 15,
				center: position
			})

			setMap(map)
		})()
	}, [containerRef])

	return map
}

// Pode ser criado um tema de mapa em: https://console.cloud.google.com/google/maps-apis/studio/styles?hl=pt-br&project=rastreamento-entregas-444304