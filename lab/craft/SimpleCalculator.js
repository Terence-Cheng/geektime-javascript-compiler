"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ASTNodeType_1 = require("./ASTNodeType");
var SimpleLexer_js_1 = require("./SimpleLexer.js");
var TokenType_ts_1 = require("./TokenType_ts");
var SimpleCalculator = /** @class */ (function () {
    function SimpleCalculator() {
    }
    /**
     * 整型变量声明语句，如：
     * int a;
     * int b = 2*3;
     *
     * @return
     * @throws Exception
     */
    SimpleCalculator.prototype.intDeclare = function (tokens) {
        var node = null;
        console.log(tokens);
        var token = tokens.peek();
        if (token !== null && token.getTypeValue() === TokenType_ts_1.default.Int) {
            console.log('int');
            token = tokens.read(); // 消耗掉int
            // @ts-ignore
            if (tokens.peek().getTypeValue() === TokenType_ts_1.default.Identifier) { // 匹配标识符
                console.log('标识符');
                token = tokens.read(); // 消耗掉标识符
                // //创建当前节点，并把变量名记到AST节点的文本值中，这里新建一个变量子节点也是可以的
                node = new SimpleASTNode(ASTNodeType_1.default.IntDeclaration, token.getText());
                token = tokens.peek(); // 预读
                if (token !== null && token.getTypeValue() === TokenType_ts_1.default.Assignment) {
                    console.log('=');
                    tokens.read(); // 把 = 消耗掉
                    // todo
                    token = tokens.read(); // 把45消耗掉
                    // SimpleASTNode child = additive(tokens);  //匹配一个表达式
                    // if (child == null) {
                    //     throw new Exception("invalide variable initialization, expecting an expression");
                    // }
                    // else{
                    //     node.addChild(child);
                    // }
                    var child = new SimpleASTNode(ASTNodeType_1.default.IntLiteral, token.getText());
                    console.log(node);
                    node.addChild(child);
                }
            }
            else {
                // Int 后面不是标识符
                throw new Error('variable name expected');
            }
            if (node !== null) {
                token = tokens.peek();
                if (token !== null && token.getTypeValue() === TokenType_ts_1.default.SemiColon) {
                    console.log('读取int声明完毕');
                    tokens.read();
                }
                else {
                    throw new Error("invalid statement, expecting semicolon");
                }
            }
        }
        return node;
    };
    /**
     * 打印输出AST的树状结构
     * @param node
     * @param indent 缩进字符，由tab组成，每一级多一个tab
     */
    SimpleCalculator.prototype.dumpAST = function (node, indent) {
        var _this = this;
        // System.out.println(indent + node.getType() + " " + node.getText());
        // for (ASTNode child : node.getChildren()) {
        //     dumpAST(child, indent + "\t");
        // }
        console.log(indent + node.getTypeValue() + ' ' + node.getText());
        var children = node.getChildren();
        children.forEach(function (child) {
            _this.dumpAST(child, indent + "\t");
        });
    };
    return SimpleCalculator;
}());
var SimpleASTNode = /** @class */ (function () {
    function SimpleASTNode(nodeType, text) {
        this.parent = null;
        this.nodeType = nodeType;
        this.text = text;
        this.children = [];
    }
    SimpleASTNode.prototype.getParent = function () {
        return this.parent;
    };
    SimpleASTNode.prototype.getChildren = function () {
        return this.children;
    };
    SimpleASTNode.prototype.getType = function () {
        return this.nodeType;
    };
    SimpleASTNode.prototype.getTypeValue = function () {
        return ASTNodeType_1.default[this.nodeType];
    };
    SimpleASTNode.prototype.getTypeText = function () {
        return ASTNodeType_1.default[this.nodeType];
    };
    SimpleASTNode.prototype.getText = function () {
        return this.text;
    };
    SimpleASTNode.prototype.addChild = function (child) {
        this.children.push(child);
        child.parent = this;
    };
    return SimpleASTNode;
}());
function test() {
    var a = new SimpleASTNode(ASTNodeType_1.default.Additive, '23333');
    console.log(a.getParent());
    console.log(ASTNodeType_1.default[a.getType()]);
    console.log(a.getTypeText());
    console.log(a.getText());
    console.log(a);
}
// test()
function testSimpleCalculator() {
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
    var calculator = new SimpleCalculator();
    // const script:string = "int a = b+3;";
    var script = "int age = 45;";
    console.log("解析变量声明语句: " + script);
    var lexer = new SimpleLexer_js_1.SimpleLexer();
    var tokens = lexer.tokenize(script);
    try {
        var node = calculator.intDeclare(tokens);
        calculator.dumpAST(node, "");
    }
    catch (e) {
    }
}
testSimpleCalculator();
