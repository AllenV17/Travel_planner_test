async function geocodeWithNominatim(query) {
	const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
	const res = await fetch(url, { headers: { 'User-Agent': 'TravelMitr/1.0 (demo)' } });
	if (!res.ok) {
		throw new Error(`Geocoding failed: ${res.status}`);
	}
	const data = await res.json();
	if (!Array.isArray(data) || data.length === 0) {
		return null;
	}
	const item = data[0];
	return {
		name: item.display_name,
		lat: parseFloat(item.lat),
		lng: parseFloat(item.lon)
	};
}

module.exports = { geocodeWithNominatim };


