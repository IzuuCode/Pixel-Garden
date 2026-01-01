export const PLANT_TYPES = {
    FLOWER: {
        id: 'flower',
        name: 'Flower',
        emoji: '🌻',
        stages: ['🌱', '🌿', '🌻'],
        growthTime: 10000, // 10s per stage
    },
    TREE: {
        id: 'tree',
        name: 'Tree',
        emoji: '🌲',
        stages: ['🌰', '🌱', '🌲'],
        growthTime: 20000, // 20s per stage
    },
};

export const TOOLS = {
    WATER: 'water',
    SHOVEL: 'shovel',
    SEED_FLOWER: 'seed_flower',
    SEED_TREE: 'seed_tree',
};

export const GRID_SIZE = 9;
export const WATER_DURATION = 30000; // 30s
export const TICK_RATE = 1000;
