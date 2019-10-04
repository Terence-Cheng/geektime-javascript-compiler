import Token from './Token_ts'
import TokenType from './TokenType_ts'
class SimpleToken implements Token {
    public type = null;
    public text: string = null;
    constructor() {
        this.type = null;
        this.text = null;
    }

    getType () {
        return this.type;
    }

    getText () {
        return this.text;
    }

    getTypeValue (): number {
        // @ts-ignore
        return TokenType[this.type]
    }
}

export default SimpleToken
