// Season specific options stored in a league configuration and passed
// through, unchanged, to the parser. A parser ignores options it does not use.
export default interface ParserOptions {
    // Days whose exits all leave in the same round (survivor only)
    dayOverrides?: number[]
}
