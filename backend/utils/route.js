// Uses OSRM public demo server for routing. Subject to rate limits.
async function getRouteSummary(from, to) {
	const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
	const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Routing failed: ${res.status}`);
	}
	const data = await res.json();
	if (!data || !data.routes || data.routes.length === 0) {
		return null;
	}
	const r = data.routes[0];
	return {
		distanceMeters: r.distance,
		durationSeconds: r.duration
	};
}

module.exports = { getRouteSummary };


