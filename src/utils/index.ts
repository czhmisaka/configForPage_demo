/*
 * @Date: 2021-12-30 15:11:39
 * @LastEditors: CZH
 * @LastEditTime: 2021-12-30 20:30:30
 * @FilePath: /configforpagedemo/src/utils/index.ts
 */
import { cellMakerOptions, templateCellOptions, infoCell } from "./cellClass";
import ImportModule from "./ImportModule";



export default {
    /**
     * @name: tableCellMaker
     * @description: 构建表格单元 - @TODO 也可以兼容使用到输入&显示单元
     * @authors: CZH
     * @Date: 2021-12-30 15:18:29
     */
    tableCellMaker: (prop: string, label: string, template: Array<templateCellOptions>, options: cellMakerOptions) => {
        let cell: infoCell = {
            key: prop,
            value: prop,
            prop,
            label,
            template,
            ...options
        }
        return cell
    },

    ...ImportModule,
}


