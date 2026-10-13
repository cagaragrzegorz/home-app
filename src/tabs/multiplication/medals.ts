export type MedalType = 'brown' | 'silver' | 'gold' | 'diamond' | null;
export type MedalsByNumber = Record<number, MedalType>;

const MEDALS_KEY = 'multiplicationMedals';

export function loadMedals(): MedalsByNumber {
    const saved = localStorage.getItem(MEDALS_KEY);
    return saved ? JSON.parse(saved) : {};
}

export function saveMedals(medals: MedalsByNumber): void {
    localStorage.setItem(MEDALS_KEY, JSON.stringify(medals));
}

export function getMedalForScore(correctCount: number): MedalType {
    if (correctCount >= 7) return 'diamond';
    if (correctCount >= 6) return 'gold';
    if (correctCount >= 5) return 'silver';
    if (correctCount >= 4) return 'brown';
    return null;
}

export function medalRank(medal: MedalType): number {
    switch (medal) {
        case 'diamond':
            return 4;
        case 'gold':
            return 3;
        case 'silver':
            return 2;
        case 'brown':
            return 1;
        default:
            return 0;
    }
}

export const MEDAL_COLORS: Record<Exclude<MedalType, null>, string> = {
    brown: '#a0622d',
    silver: '#b0b4bb',
    gold: '#e0b020',
    diamond: '#4fc3e0',
};

export const MEDAL_LABELS: Record<Exclude<MedalType, null>, string> = {
    brown: 'Brązowy medal (4 poprawne)',
    silver: 'Srebrny medal (5 poprawnych)',
    gold: 'Złoty medal (6 poprawnych)',
    diamond: 'Diamentowy medal (7 poprawnych)',
};
