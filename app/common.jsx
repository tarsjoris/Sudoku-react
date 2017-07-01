export const GRID_ACTION_TOGGLE = 'GRID_ACTION_TOGGLE'
export const GRID_ACTION_ELIMINATE = 'GRID_ACTION_ELIMINATE'
export const GRID_ACTION_UNDO = 'GRID_ACTION_UNDO'
export const SIZE = 3
export const AID = true

export const cellIndex = (x, y) => y * SIZE * SIZE + x

/**
 * A zone is set of cells that should not have the same value.
 * You have a zone for each column, one for each row and for each block.
 * This funtion calculates which cells belong to the same zone.
 */
const calculateZones = () => {
	const zonesToCells = []
	const cellsToZones = []
	for (var i = 0; i < SIZE * SIZE * 3; ++i) {
		zonesToCells.push([])
	}
	for (var i = 0; i < SIZE * SIZE * SIZE * SIZE; ++i) {
		cellsToZones.push([])
	}
	for (var y = 0; y < SIZE * SIZE; ++y) {
		for (var x = 0; x < SIZE * SIZE; ++x) {
			const index = cellIndex(x, y)
			const blockIndex = Math.floor(y / SIZE) * SIZE + Math.floor(x / SIZE)
			const zoneIndexes = [
				x,
				SIZE * SIZE + y,
				SIZE * SIZE * 2 + blockIndex
			]
			zoneIndexes.forEach((zoneIndex) => {
				zonesToCells[zoneIndex].push(index)
				cellsToZones[index].push(zoneIndex)
			})
		}
	}
	return {
		zonesToCells,
		cellsToZones
	}
}

export const ZONES = calculateZones()