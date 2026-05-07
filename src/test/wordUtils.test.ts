import { resolveSearchWord } from '../wordUtils';

describe('resolveSearchWord', () => {
    // d-prefix words: strip from first underscore
    it('strips suffix after underscore for d-prefixed constant', () => {
        expect(resolveSearchWord('dCAMVINDICATOR_CHOS')).toBe('dCAMVINDICATOR');
    });

    it('strips multiple underscore segments, keeping only first part', () => {
        expect(resolveSearchWord('dFOO_BAR_BAZ')).toBe('dFOO');
    });

    it('returns d-prefixed word unchanged when no underscore', () => {
        expect(resolveSearchWord('dCAMVINDICATOR')).toBe('dCAMVINDICATOR');
    });

    // non-d-prefix words: returned unchanged even if they contain underscores
    it('returns unchanged word not starting with d-uppercase pattern', () => {
        expect(resolveSearchWord('caUtilBlkEventTypes')).toBe('caUtilBlkEventTypes');
    });

    it('returns unchanged word with underscore not matching d-prefix rule', () => {
        expect(resolveSearchWord('caUtil_BlkEventTypes')).toBe('caUtil_BlkEventTypes');
    });

    // edge: lowercase 'd' without immediate uppercase — not a constant, leave alone
    it('does not strip word starting with d followed by lowercase', () => {
        expect(resolveSearchWord('doSomething_Else')).toBe('doSomething_Else');
    });

    it('handles empty string', () => {
        expect(resolveSearchWord('')).toBe('');
    });

    it('handles single character d', () => {
        expect(resolveSearchWord('d')).toBe('d');
    });
});
