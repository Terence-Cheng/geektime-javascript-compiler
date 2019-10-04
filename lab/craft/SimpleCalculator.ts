import ASTNode from './ASTNode'
import ASTNodeType from "./ASTNodeType";
import {SimpleLexer} from "./SimpleLexer.js";
// import Token from './Token_ts'
import TokenReader from './TokenReader'
import TokenType from './TokenType_ts'

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
                    // todo
                    token = tokens.read() // 把45消耗掉
                    // SimpleASTNode child = additive(tokens);  //匹配一个表达式
                    // if (child == null) {
                    //     throw new Exception("invalide variable initialization, expecting an expression");
                    // }
                    // else{
                    //     node.addChild(child);
                    // }
                    const child = new SimpleASTNode(ASTNodeType.IntLiteral, token.getText())
                    console.log(node)
                    node.addChild(child)
                }

            } else {
                // Int 后面不是标识符
                throw new Error('variable name expected')
            }



            if (node !== null) {
                token = tokens.peek();
                if (token !== null && token.getTypeValue() === TokenType.SemiColon) {
                    console.log('读取int声明完毕');
                    tokens.read();
                } else {
                    throw new Error("invalid statement, expecting semicolon");
                }
            }
        }
        return node
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
    const script:string = "int age = 45;";
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
