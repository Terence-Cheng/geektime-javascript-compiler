import TokenReader from './TokenReader'
class SimpleTokenReader implements TokenReader {
    public tokens: [] = null
    constructor(tokens) {
        this.tokens = tokens;
    }
    peek () {
        if (!this.tokens || !this.tokens.length) {
            return null;
        }
        // @ts-ignore
        return this.tokens[0]
    }
    read () {
        if (!this.tokens.length) {
            return null;
        }
        return this.tokens.shift()
    }
}

export default SimpleTokenReader
