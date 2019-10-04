const { TokenType } = require('./TokenType');
const { Token } = require('./Token');
const SimpleToken = require('./SimpleToken').default
const SimpleTokenReader = require('./SimpleTokenReader').default

const DfaState = {
  Initial: 'Initial',
  Id_int1: 'Id_int1',
  Id_int2: 'Id_int2',
  Id_int3: 'Id_int3',
  Id: 'Id',
  IntLiteral: 'IntLiteral',
  GT: 'GT',
  GE: 'GE',
  Assignment: 'Assignment',
  Plus: 'Plus', Minus: 'Minus', Star: 'Star', Slash: 'Slash',
  SemiColon: 'SemiColon',
}


/*
* 有限自动机-简单地手工词法分析器
* */
class SimpleLexer {
  constructor () {
    this.tokens = []; //保存解析出来的Token
    this.tokenText = ''; //临时保存token的文本
    this.token = null; //当前正在解析的Token
  }

  /**
   * 解析字符串，形成Token。
   * 这是一个有限状态自动机，在不同的状态中迁移。
   * @param code
   * @return
   */
  tokenize (code) {
    this.tokens = [];
    const reader = code;
    this.tokenText = '';
    this.token = new SimpleToken();
    // let ich = 0;
    // let ch = 0;

    let state = DfaState.Initial;

    try {
      for (let ch of reader) {
        // console.log(ch);
        switch (state) {
          case 'Initial':
            state = this.initToken(ch);
            break;
          case 'Id_int1':
            if (ch === 'n') {
              state = DfaState.Id_int2;
              this.tokenText = this.tokenText + ch;
            } else if (this.isDigit(ch) || this.isAlpha(ch)) {
              state = DfaState.Id;
              this.tokenText = this.tokenText + ch;
            } else {
              state = this.initToken(ch);
            }
            break;
          case 'Id_int2':
            if (ch === 't') {
              state = DfaState.Id_int3;
              this.tokenText = this.tokenText + ch;
            } else if (this.isDigit(ch) || this.isAlpha(ch)) {
              state = DfaState.Id;
              this.tokenText = this.tokenText + ch;
            } else {
              state = this.initToken(ch);
            }
            break;
          case 'Id_int3':
            if (this.isBlank(ch)) {
              this.token.type = TokenType.Int;
              state = this.initToken(ch);
            } else {
              state = DfaState.Id;
              this.tokenText = this.tokenText + ch;
            }
            break;
          case 'Id':
            if (this.isAlpha(ch) || this.isDigit(ch)) {
              this.tokenText = this.tokenText + ch;
            } else {
              state = this.initToken(ch);
            }
            break;
          case 'GT':
            if (ch === '=') {
              this.token.type = TokenType.GE;
              state = DfaState.GE;
              this.tokenText = this.tokenText + ch;
            } else {
              state = this.initToken(ch);
            }
            break;
          case 'GE':
          case 'Assignment':
          case 'Plus':
          case 'Minus':
          case 'Star':
          case 'Slash':
          case 'SemiColon':
            state = this.initToken(ch);
            break;
          case 'IntLiteral':
            if (this.isDigit(ch)) {
              this.tokenText = this.tokenText + ch; // 继续保持数字字面量状态
            } else {
              state = this.initToken(ch);
            }
            break;
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (this.tokenText) {
      this.initToken();
    }
    // console.log(this.tokens);
    return new SimpleTokenReader(this.tokens);
  }

  /**
   * 有限状态机进入初始状态。
   * 这个初始状态其实并不做停留，它马上进入其他状态。
   * 开始解析的时候，进入初始状态；某个Token解析完毕，也进入初始状态，在这里把Token记下来，然后建立一个新的Token。
   * @param ch
   * @return
   */
  initToken (ch) {
    if (this.tokenText.length) {
      this.token.text = this.tokenText;
      this.tokens.push(this.token);

      this.tokenText = ''
      this.token = new SimpleToken()
    }

    let newState = DfaState.Initial;

    if (this.isAlpha(ch)) {
      if (ch === 'i') {
        newState = DfaState.Id_int1;
      } else {
        newState = DfaState.Id;
      }

      this.token.type = TokenType.Identifier;
      this.tokenText = this.tokenText + ch;
    } else if (this.isDigit(ch)) {
      newState = DfaState.IntLiteral;
      this.token.type = TokenType.IntLiteral;
      this.tokenText = this.tokenText + ch;
    } else if (ch === '>') {
      newState = DfaState.GT;
      this.token.type = TokenType.GT;
      this.tokenText = this.tokenText + ch;
    } else if (ch === '=') {
      newState = DfaState.Assignment;
      this.token.type = TokenType.Assignment;
      this.tokenText = this.tokenText + ch;
    } else if (ch === '+') {
      newState = DfaState.Plus;
      this.token.type = TokenType.Plus;
      this.tokenText = this.tokenText + ch;
    } else if (ch === '-') {
      newState = DfaState.Minus;
      this.token.type = TokenType.Minus;
      this.tokenText = this.tokenText + ch;
    } else if (ch === '*') {
      newState = DfaState.Star;
      this.token.type = TokenType.Star;
      this.tokenText = this.tokenText + ch;
    } else if (ch === '/') {
      newState = DfaState.Slash;
      this.token.type = TokenType.Slash;
      this.tokenText = this.tokenText + ch;
    } else if (ch === ';') {
      // SemiColon
      newState = DfaState.SemiColon;
      this.token.type = TokenType.SemiColon;
      this.tokenText = this.tokenText + ch;
    }

    return newState;
  }

  isAlpha (ch) {
    // console.log(`${ch} is a alpha ? ${(ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')}`)
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  }

  isDigit (ch) {
    // console.log(`${ch} is a digit ? ${ch >= '0' && ch <= '9'}`)
    return ch >= '0' && ch <= '9';
  }

  isBlank(ch) {
    return ch === ' ' || ch === '\t' || ch === '\n';
  }
}

/**
 * Token的一个简单实现。只有类型和文本值两个属性。
 */
// class SimpleToken extends Token {
//   constructor(props) {
//     super(props);
//     this.type = null;
//     this.text = null;
//   }
//
//   getType () {
//     return this.type;
//   }
//
//   getText () {
//     return this.text;
//   }
// }

/**
 * 一个简单的Token流。是把一个Token列表进行了封装。
 */
// class SimpleTokenReader {
//   constructor(tokens) {
//     this.tokens = tokens;
//   }
//   peek () {
//     if (!this.tokens.length) {
//       return null;
//     }
//     return this.tokens[0]
//   }
//   read () {
//     if (!this.tokens.length) {
//       return null;
//     }
//     return this.tokens.shift()
//   }
// }

function dump(tokenReader){
  console.log("text\ttype");
  // console.log(tokenReader)
  for (let token of tokenReader.tokens) {
    console.log(token.getText()+"\t" + token.getType());
  }
}

function test() {
  testUnit('age >= 45');
  testUnit('age > 45;');
  testUnit('int age = 45;')
  testUnit('in age = 45;')
  testUnit('inta age = 45;')
  testUnit('2+3*5')
}


function testUnit(script) {
  const lexer = new SimpleLexer();
  console.log("\nparse :" + script);
  let tokenReader = lexer.tokenize(script);
  dump(tokenReader);
}

// test();

exports.SimpleLexer = SimpleLexer
