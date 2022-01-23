/*
 * @Date: 2021-12-30 15:11:39
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-23 21:38:08
 * @FilePath: /configforpagedemo/src/utils/index.ts
 */
import { cellMakerOptions, templateCellOptions } from "./cellClass";
import * as Icons from '@element-plus/icons-vue'
import { h } from "vue";

// 对象字符串判空
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
    return key in object;
}

export function getIcon(name: string) {
    console.log(name)
    if (isValidKey(name, Icons)) {
        return Icons[name]
    } else {
        return h('p', {}, ['未找到这个图标'])
    }
}



export default {
    /**
     * @name: tableCellMaker
     * @description: 构建表格单元 - @TODO 也可以兼容使用到输入&显示单元
     * @authors: CZH
     * @Date: 2021-12-30 15:18:29
     */
    tableCellMaker: (prop: string, label: string, template: Array<templateCellOptions>, options: cellMakerOptions) => {
        return {
            key: prop,
            value: prop,
            prop,
            label,
            template,
            ...options
        }
    },
    isValidKey,
}

