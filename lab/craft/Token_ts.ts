import TokenType from './TokenType_ts'
/**
 * 一个简单的Token。
 * 只有类型和文本值两个属性。
 */
interface Token_ts {

    /**
     * Token的类型 字符串
     * @return
     */
    getType(): TokenType

    /**
     * Token的类型 数值
     * @return
     */
    getTypeValue(): number

    /**
     * Token的文本值
     * @return
     */
    getText(): string

}

export default Token_ts
