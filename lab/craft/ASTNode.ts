import ASTNodeType from './ASTNodeType'

interface ASTNode {
    getParent(): ASTNode
    getChildren(): Array<ASTNode>
    getType(): ASTNodeType
    getTypeValue(): string
    getText(): string
}

export default ASTNode
