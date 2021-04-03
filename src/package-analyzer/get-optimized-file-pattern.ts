const optimizedFilePatterns: Record<string, string> = {
    typescript: 'lib/typescript.d.ts',
};

export function getOptimizedFilePattern({
    name,
    ignoreFilePatternOptimizations = false,
}: {
    name: string;
    ignoreFilePatternOptimizations?: boolean;
}): string | undefined {
    if (ignoreFilePatternOptimizations) {
        return undefined;
    }

    return optimizedFilePatterns[name];
}
