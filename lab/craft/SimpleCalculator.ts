import ASTNode from './ASTNode'
import ASTNodeType from "./ASTNodeType";
import {SimpleLexer} from "./SimpleLexer.js";
// import Token from './Token_ts'
import TokenReader from './TokenReader'
import TokenType from './TokenType_ts'

/**
 * 实现一个计算器，但计算的结合性是有问题的。因为它使用了下面的语法规则：
 *
 * additive -> multiplicative | multiplicative + additive
 * multiplicative -> primary | primary * multiplicative
 *
 * 递归项在右边，会自然的对应右结合。我们真正需要的是左结合。
 */
class SimpleCalculator {
    constructor() {

    }
    /**
     * 整型变量声明语句，如：
     * int a;
     * int b = 2*3;
     *
     * @return
     * @throws Exception
     */
    intDeclare(tokens: TokenReader): SimpleASTNode {
        let node: SimpleASTNode = null
        console.log(tokens);
        let token = tokens.peek()
        if (token !== null && token.getTypeValue() === TokenType.Int) {
            console.log('int')
            token = tokens.read() // 消耗掉int
            // @ts-ignore
            if (tokens.peek().getTypeValue() === TokenType.Identifier) { // 匹配标识符
                console.log('标识符')
                token = tokens.read() // 消耗掉标识符
                // //创建当前节点，并把变量名记到AST节点的文本值中，这里新建一个变量子节点也是可以的
                node = new SimpleASTNode(ASTNodeType.IntDeclaration, token.getText())
                token = tokens.peek() // 预读
                if (token !== null && token.getTypeValue() === TokenType.Assignment) {
                    console.log('=')
                    tokens.read() // 把 = 消耗掉

                    const child = this.additive(tokens)
                    if (child === null) {
                        console.error('invalide variable initialization, expecting an expression');
                        throw new Error("invalide variable initialization, expecting an expression");
                    } else {
                        node.addChild(child)
                    }
                    // SimpleASTNode child = additive(tokens);  //匹配一个表达式
                    // if (child == null) {
                    //     throw new Exception("invalide variable initialization, expecting an expression");
                    // }
                    // else{
                    //     node.addChild(child);
                    // }

                    /*//
                    token = tokens.read() // 把45消耗掉
                    const child = new SimpleASTNode(ASTNodeType.IntLiteral, token.getText())
                    console.log(node)
                    node.addChild(child)*/
                }

            } else {
                // Int 后面不是标识符
                console.error('variable name expected')
                throw new Error('variable name expected')
            }



            if (node !== null) {
                token = tokens.peek();
                if (token !== null && token.getTypeValue() === TokenType.SemiColon) {
                    console.log('读取int声明完毕');
                    tokens.read();
                } else {
                    console.error("invalid statement, expecting semicolon")
                    throw new Error("invalid statement, expecting semicolon");
                }
            }
        }
        return node
    }

    /**
     * 语法解析：加法表达式
     * @return
     * @throws Exception
     */
    additive(tokens: TokenReader): SimpleASTNode {
        let child1 = this.multiplicative(tokens)
        let node = child1
        let token = tokens.peek()
        if (child1 !== null && token !== null) {
            if (token.getTypeValue() === TokenType.Plus || token.getType() === TokenType.Minus) {
                token = tokens.read()
                const child2 = this.additive(tokens)
                if (child2 !== null) {
                    node = new SimpleASTNode(ASTNodeType.Additive, token.getText())
                    node.addChild(child1)
                    node.addChild(child2)
                } else {
                    console.error("invalid additive expression, expecting the right part.")
                    throw new Error("invalid additive expression, expecting the right part.");
                }
            }
        }
        return node;
    }

    /**
     * 语法解析：乘法表达式
     * @return
     * @throws Exception
     */
    multiplicative(tokens: TokenReader): SimpleASTNode {
        const child1: SimpleASTNode = this.primary(tokens)
        let node = child1
        let token = tokens.peek()
        if(child1 !== null && token !== null) { // 有一个数字或者id标识符 && 还有一个token
            if (token.getTypeValue() === TokenType.Star || token.getTypeValue() === TokenType.Slash) {
                // token类型为 x /
                token = tokens.read();
                const child2 = this.multiplicative(tokens) // 继续解析下一个token
                if (child2 !== null) {
                    node = new SimpleASTNode(ASTNodeType.Multiplicative, token.getText())
                    node.addChild(child1) // 乘号前的节点
                    node.addChild(child2) // 乘号后的节点
                } else {
                    console.error("invalid multiplicative expression, expecting the right part.")
                    throw new Error("invalid multiplicative expression, expecting the right part.");
                }
            }
        }
        return node;
    }

    /**
     * 语法解析：基础表达式(数字、ID标识符)
     * @return SimpleASTNode
     * @throws Exception
     */
    primary(tokens: TokenReader): SimpleASTNode {

        let node: SimpleASTNode = null
        let token = tokens.peek()
        console.log('基础表达式primary读取到的token', token)
        if (token !== null) {
            if (token.getTypeValue() === TokenType.IntLiteral) {
                console.log('\t是IntLiteral类型数字节点')
                token = tokens.read()
                node = new SimpleASTNode(ASTNodeType.IntLiteral, token.getText())
            } else if (token.getTypeValue() === TokenType.Identifier) {
                console.log('\t是Identifier类型节点')
                token = tokens.read()
                node = new SimpleASTNode(ASTNodeType.Identifier, token.getText())
            } else if (token.getTypeValue() === TokenType.LeftParen) {
                // omit
                console.log('\t出现了左括号')
                // tokens.read();
                // node = additive(tokens);
                // if (node != null) {
                //     token = tokens.peek();
                //     if (token != null && token.getType() == TokenType.RightParen) {
                //         tokens.read();
                //     } else {
                //         throw new Exception("expecting right parenthesis");
                //     }
                // } else {
                //     throw new Exception("expecting an additive expression inside parenthesis");
                // }
            }
        }
        return node;
        // return node;  //这个方法也做了AST的简化，就是不用构造一个primary节点，直接返回子节点。因为它只有一个子节点。

    }

    /**
     * 打印输出AST的树状结构
     * @param node
     * @param indent 缩进字符，由tab组成，每一级多一个tab
     */
    dumpAST(node: ASTNode, indent: string) {
        // System.out.println(indent + node.getType() + " " + node.getText());
        // for (ASTNode child : node.getChildren()) {
        //     dumpAST(child, indent + "\t");
        // }
        console.log(indent + node.getTypeValue() + ' ' + node.getText())
        const children = node.getChildren();
        children.forEach(child => {
            this.dumpAST(child, indent+ "\t");
        })

    }
}

class SimpleASTNode implements ASTNode {
    private readonly text: string
    private readonly nodeType: ASTNodeType
    private parent : SimpleASTNode = null
    public children : ASTNode[];
    constructor(nodeType: ASTNodeType, text: string) {
        this.nodeType = nodeType
        this.text = text
        this.children = []
    }
    public getParent(): SimpleASTNode {
        return this.parent
    }
    public getChildren(): ASTNode[] {
        return this.children
    }
    public getType(): ASTNodeType {
        return this.nodeType
    }
    public getTypeValue(): string {
        return ASTNodeType[this.nodeType]
    }
    public getTypeText(): string {
        return ASTNodeType[this.nodeType]
    }
    public getText(): string {
        return this.text
    }
    public addChild(child: SimpleASTNode): void {
        this.children.push(child)
        child.parent = this
    }
}

function test(): void {
    const a = new SimpleASTNode(ASTNodeType.Additive,'23333')
    console.log(a.getParent())
    console.log(ASTNodeType[a.getType()])
    console.log(a.getTypeText())
    console.log(a.getText())
    console.log(a)
}

// test()

function testSimpleCalculator() : void {
    //测试变量声明语句的解析
    // String script = "int a = b+3;";
    // System.out.println("解析变量声明语句: " + script);
    // SimpleLexer lexer = new SimpleLexer();
    // TokenReader tokens = lexer.tokenize(script);
    // try {
    //     SimpleASTNode node = calculator.intDeclare(tokens);
    //     calculator.dumpAST(node,"");
    // }
    // catch (Exception e){
    //     System.out.println(e.getMessage());
    // }
    const calculator = new SimpleCalculator()
    // const script:string = "int a = b+3;";
    const script:string = "int age = 2 + 3 * 5;";
    console.log("解析变量声明语句: " + script)
    const lexer = new SimpleLexer()
    const tokens = lexer.tokenize(script)
    try {
        const node: SimpleASTNode = calculator.intDeclare(tokens);
        calculator.dumpAST(node,"");
    } catch (e) {

    }
}

testSimpleCalculator()
