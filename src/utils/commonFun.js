

/**
 * description: 摄氏度转华氏度,根据入参来保留小数点位数
 * @param {Number} celsius 摄氏度
 * @param {Number} decimal 小数点位数
 * @return {Number} 华氏度
 */
function CtoF(celsius, decimal = 1) {
    let fahrenheit = (celsius * 1.8) + 32;
    return parseFloat(fahrenheit.toFixed(decimal));
}

/**
 * description: 华氏度转摄氏度,根据入参来保留小数点位数
 * @param {Number} fahrenheit 华氏度
 * @param {Number} decimal 小数点位数
 * @return {Number} 摄氏度
 */
function FtoC(fahrenheit, decimal = 1) {
    let celsius = (fahrenheit - 32) / 1.8;
    return parseFloat(celsius.toFixed(decimal));
}



/**
 * description: 千克转磅,根据入参来保留小数点位数
 * @param {Number} kg 千克
 * @param {Number} decimal 小数点位数
 * @return {Number} 磅
 */
function KgtoLb(kg, decimal = 2) {
    let pound = kg * 2.2046;
    return parseFloat(pound.toFixed(decimal));
}
/**
 * description: 磅转千克,根据入参来保留小数点位数
 * @param {Number} lb 磅
 * @param {Number} decimal 小数点位数
 * @return {Number} 千克
 * 
 */
function LbtoKg(lb, decimal = 2) {
    let kilogram = lb / 2.2046;
    return parseFloat(kilogram.toFixed(decimal));
}

/**
 * description: 克转毫升,根据入参来保留小数点位数
 * @param {Number} gram 克
 * @param {Number} decimal 小数点位数
 * @return {Number} 毫升
 */
function GToMl(gram, decimal = 2) {
    let milliliter = gram
    return parseFloat(milliliter.toFixed(decimal));
}

/**
 * description: 毫升转克,根据入参来保留小数点位数
 * @param {Number} ml 毫升
 * @param {Number} decimal 小数点位数
 * @return {Number} 克
 */
function MltoG(ml, decimal = 2) {
    let gram = ml;
    return parseFloat(gram.toFixed(decimal));
}

/**
 * @description: 克转盎司,根据入参来保留小数点位数
 * @param {Number} gram 克
 * @param {Number} decimal 小数点位数
 * @return {Number} 盎司
 */
function GToOz(gram, decimal = 2) {
    let ounce = gram / 28.3495;
    return parseFloat(ounce.toFixed(decimal));
}

/**
 * @description: 盎司转克,根据入参来保留小数点位数
 * @param {Number} ounce 盎司
 * @param {Number} decimal 小数点位数
 * @return {Number} 克
 */
function OztoG(ounce, decimal = 2) {
    let gram = ounce * 28.3495;
    return parseFloat(gram.toFixed(decimal));
}







/**
 * description: 厘米转英寸,根据入参来保留小数点位数
 * @param {Number} cm 厘米
 * @param {Number} decimal 小数点位数
 * @return {Number} 英寸
 */
function CmtoIn(cm, decimal = 2) {
    let inch = cm / 2.54;
    return parseFloat(inch.toFixed(decimal));
}
/**
 * description: 英寸转厘米,根据入参来保留小数点位数
 * @param {Number} inch 英寸
 * @param {Number} decimal 小数点位数
 * @return {Number} 厘米
 */
function IntoCm(inch, decimal = 2) {
    let cm = inch * 2.54;
    return parseFloat(cm.toFixed(decimal));
}





