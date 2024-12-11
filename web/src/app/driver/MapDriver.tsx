'use client'

import { ComponentProps, RefObject, useRef } from "react"
import { useMap } from "@/hooks/useMap"

export type MapDriverProps = ComponentProps<'div'>

export function MapDriver(props: MapDriverProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null)

	useMap(mapContainerRef as RefObject<HTMLDivElement>)

	return (
		<div {...props} ref={mapContainerRef}></div>
	)
}