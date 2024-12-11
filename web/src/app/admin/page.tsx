'use client'

import { useMap } from "@/hooks/useMap"
import { RefObject, useRef } from "react"

export default function Admin() {
	const mapContainerRef = useRef<HTMLDivElement>(null)

	useMap(mapContainerRef as RefObject<HTMLDivElement>)

	return (
		<div className="w-screen h-screen" ref={mapContainerRef}></div>
	)
}