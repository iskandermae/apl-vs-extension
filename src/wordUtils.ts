/**
 * Rules:
 *  - Domain value => Domain
 *    Domain value is the word starting with 'd' followed by an uppercase letter
 *    e.g.  dCAMVINDICATOR_CHOS  →  dCAMVINDICATOR
 *  - All other words are returned unchanged.
 */
export function resolveSearchWord(word: string): string {
    if (/^d[A-Z]/.test(word)) {
        return word.split('_')[0];
    }
    return word;
}
