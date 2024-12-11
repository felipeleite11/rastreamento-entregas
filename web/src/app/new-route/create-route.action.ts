'use server'

export async function createRouteAction(state: any, formData: FormData) {
	const { sourceId, destinationId } = Object.fromEntries(formData)

	const directionsResponse = await fetch(`http://localhost:3000/directions?originId=${sourceId}&destinationId=${destinationId}`, {
		// next: {
		// 	revalidate: 1 * 60 * 60 * 24 // 1 day
		// },
		// cache: 'force-cache'
	})

	if(!directionsResponse.ok) {
		return { error: 'Erro ao buscar as direções.' }
	}

	const directionsData = await directionsResponse.json()

	const { start_address: startAddress, end_address: endAddress } = directionsData.routes[0].legs[0]
	const { origin, destination } = directionsData.request

	const response = await fetch('http://localhost:3000/routes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: `${startAddress} - ${endAddress}`,
			source_id: origin.place_id.replace('place_id:', ''),
			destination_id: destination.place_id.replace('place_id:', '')
		})
	})

	if(!response.ok) {
		return { error: 'Erro ao criar a rota.' }
	}

	return { success: true }
}
