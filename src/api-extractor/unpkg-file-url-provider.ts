export type UnpkgFileURLProvider = ({
    filename,
    line,
}: {
    filename: string;
    line?: number;
}) => string | undefined;

export function getUnpkgFileURLProvider({
    id,
}: {
    id?: string;
}): UnpkgFileURLProvider {
    if (!id) {
        return () => undefined;
    }

    return ({ filename, line }) => {
        const fileURL = `https://unpkg.com/browse/${id}/${filename}`;
        if (!line) {
            return fileURL;
        }

        return `${fileURL}#L${line}`;
    };
}
