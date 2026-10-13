export type Equation = {
    base: number;
    multiplier: number;
    answer: number;
};

export function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function createEquationsForNumber(base: number): Equation[] {
    return Array.from({length: 12}, (_, i) => {
        const multiplier = i + 1;
        return {base, multiplier, answer: base * multiplier};
    });
}

export function randomEquationForNumber(base: number): Equation {
    const multiplier = Math.floor(Math.random() * 12) + 1;
    return {base, multiplier, answer: base * multiplier};
}

export function generateOptions(equation: Equation): number[] {
    const {base, multiplier, answer} = equation;
    const candidates = new Set<number>();

    const nearMisses = [
        base * (multiplier - 1),
        base * (multiplier + 1),
        answer - base,
        answer + base,
        answer - multiplier,
        answer + multiplier,
    ].filter((n) => n > 0 && n !== answer);

    const shuffledNearMisses = shuffle(nearMisses);
    for (const candidate of shuffledNearMisses) {
        if (candidates.size >= 2) break;
        candidates.add(candidate);
    }

    let fallbackOffset = 1;
    while (candidates.size < 2) {
        const low = answer - fallbackOffset;
        const high = answer + fallbackOffset;
        if (low > 0 && low !== answer && !candidates.has(low)) {
            candidates.add(low);
        }
        if (candidates.size < 2 && high !== answer && !candidates.has(high)) {
            candidates.add(high);
        }
        fallbackOffset++;
    }

    return shuffle([answer, ...Array.from(candidates)]);
}
