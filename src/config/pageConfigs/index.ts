/*
 * @Date: 2021-12-30 19:54:50
 * @LastEditors: CZH
 * @LastEditTime: 2021-12-30 20:40:54
 * @FilePath: /configforpagedemo/src/config/pageConfigs/index.ts
 */




import utils from "@/utils";
import { searchOptions } from "@/utils/ImportModule";

let modules: Array<object> = []
let pathList: Array<searchOptions> = []

pathList.push({
    src: './taskList/',
})
modules = utils.searchModulesByPath(pathList)


export default {
    ...modules
}