import _ from 'lodash';
import moment from 'moment';

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
export function KgtoLb(kg, decimal = 2) {
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
export function LbtoKg(lb, decimal = 2) {
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
/**
 * @description: 计算宠物年龄
 * @param {string} birthday 宠物生日
 * @return {number | string} age | ‘unknown’
 */
export const calculateAge = (birthday) => {
  if (_.isEmpty(birthday)) {
    return "unknown";
  } else {
    return moment().diff(moment(birthday), "years");
  }
};
/**
 * @description: 没有上传照片的宠物头像展示
 * @param {Number} petSpeciesBreedId 宠物品种id
 * @return {string} 'cat' 'dog' 'other'
 */
export const petPicture = (petSpeciesBreedId) => {
  if (petSpeciesBreedId === 11001 || _.inRange(petSpeciesBreedId, 1, 136)) {
    return 'cat';
  } else if (
    petSpeciesBreedId === 12001 ||
    _.inRange(petSpeciesBreedId, 136, 456)
  ) {
    return 'dog';
  } else if (petSpeciesBreedId === 13001) {
    return 'other';
  } else {
    return 'other';
  }
}
/**
 * @dec 判断版本1是否大于版本2
 * @param {str} version1 版本号1,格式必须为1.0.0
 * @param {*} version2 版本号2,格式必须为1.0.0
 * @returns 版本1是否大于版本2
 */
export const versionComarision = (version1, version2) => {
  let version1Arr = version1.split('.')
  let version2Arr = version2.split('.')
  function num(params) {
    return parseInt(params)
  }
  if (num(version1Arr[0]) >= num(version2Arr[0])
    && num(version1Arr[1]) >= num(version2Arr[1])
    && num(version1Arr[2]) > num(version2Arr[2])
  ) {
    return true
  } else {
    return false
  }
}
/**
 *
 * @param {*} time
 * @returns
 */
export const transitionTime = (time) => {
  let timeDifference = new Date().getTimezoneOffset();
  let newTime = moment(time).subtract(timeDifference, 'm').format();
  return newTime;
}
/**
 * @dec 获取瘦体重（g)
 * @param {*} headCircumference 头部周长（cm)
 * @param {*} hindlimbLength    后肢长度（cm）
 * @param {*} forelimbCircumference 前肢周长（cm)
 * @param {*} forelimbLength        前肢长度(cm)
 * @param {*} bodyLength            身体长度（cm)
 * @param {*} upperTorsoCircumference 胸部周长(cm)
 * @returns 返回猫的瘦体重
 */
export const catLeanBodyMass = (headCircumference, hindlimbLength, forelimbCircumference, forelimbLength, bodyLength, upperTorsoCircumference) => {
  console.log('headCircumference, hindlimbLength, forelimbCircumference, forelimbLength, bodyLength, upperTorsoCircumference: ', headCircumference, hindlimbLength, forelimbCircumference, forelimbLength, bodyLength, upperTorsoCircumference);
  //头部直径
  let headDiameter = headCircumference / 3
  let value = 30.3 * (headDiameter * hindlimbLength) + 316.9 * forelimbCircumference + 2.55 * (upperTorsoCircumference / 3) * forelimbLength + 14.4 * bodyLength - 3058.7
  return value
}
/**
* @dec 获取脂肪质量（g)
* @param {*} weight            宠物体重（lb)
* @param {*} headCircumference 头部周长（cm)
* @param {*} forelimbLength    前肢长度(cm)
* @param {*} forelimbCircumference 前肢周长（cm)
* @returns
*/
export const catFatMass = (weight, headCircumference, forelimbLength, forelimbCircumference) => {
  console.log('weight, headCircumference, forelimbLength, forelimbCircumference: ', weight, headCircumference, forelimbLength, forelimbCircumference);

  return 436.9 * weight - 24 * (headCircumference / 3) * forelimbLength - 309.2 * forelimbCircumference + 2522.7
}
/**
* @dec 狗的瘦体重
* @param {*} weight            宠物体重（lb)
* @param {*} age               年龄
* @param {*} headCircumference 头部周长（cm)
* @param {*} forelimbLength    前肢长度(cm)
* @param {*} hindlimbLength     后肢长度（cm）
* @returns
*/
export const dogLeanBodyMass = (weight, age, headCircumference, forelimbLength, hindlimbLength) => {
  return 1.8 * (8.25 * weight - 9.02 * age + 8.92 * ((headCircumference / 6) ** 2) + 96.86 * forelimbLength - 111.07 * (forelimbLength - hindlimbLength) - 357.18) ** 1.333
}

/**
*
* @param {*} weight                宠物体重（lb)
* @param {*} hindlimbLength  后肢长度（cm）
* @param {*} upperTorsoCircumference 胸部周长(cm)
* @param {*} headCircumference 头部周长（cm)
* @returns
*/
export const dogFatMass = (weight, hindlimbLength, upperTorsoCircumference, headCircumference) => {
  return 229.04 * weight - 416.63 * (hindlimbLength ** 1.2) + 157.78 * (upperTorsoCircumference - headCircumference) + 908.79
}
/**
* @dec 计算狗的体脂百分比
* @param {*} upperTorsoCircumference  胸部周长(cm)
* @param {*} lowerTorsoCircumference   下躯干周长（cm）
* @param {*} hindlimbLength 后肢长度（cm）
* @param {*} headCircumference 头部周长（cm)
* @returns
*/
export const dogBodyFatPercentage = (upperTorsoCircumference, lowerTorsoCircumference, hindlimbLength, headCircumference) => {
  return 0.71 * upperTorsoCircumference - 0.1 * ((lowerTorsoCircumference / 6) ** 2) - 5.78 * (hindlimbLength ** 0.8) + 26.56 * (lowerTorsoCircumference / headCircumference) + 2.06
}
/**
 * @dec 切换主题颜色
 * @param {*} selectHardwareType 选择的硬件类型
 * @returns 颜色
 */
export const changeThemeColor = (selectHardwareType) => {
  switch (selectHardwareType) {
    case 'mellaPro':
      return '#e1206d';
    case 'biggie':
      return '#12ADE4';
    case 'tape':
      return '#D5B019';
    case 'otterEQ':
      return '#FFA132';
    case 'mabel':
      return '#F78F2F';
    default:
      return '#e1206d';
  }
}







