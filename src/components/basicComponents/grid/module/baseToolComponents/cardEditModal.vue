<!--
 * @Date: 2022-05-24 14:14:42
 * @LastEditors: CZH
 * @LastEditTime: 2022-06-28 22:36:55
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/cardEditModal.vue
-->

<template>
  <span>
    <div :class="'baseModal ' + (modalControl.isOpen ? 'open' : 'close')" @click="close">
      <div class="formModalBox" @click.stop="fuckNothing">
        <el-card header="组件模式" class="card">
          <el-form ref="form" v-on:submit.prevent>
            <el-form-item label="模式">
              <el-radio-group
                v-model="cardComponentDetail.type"
                size="large"
                placeholder="组件加载模式"
              >
                <el-radio-button
                  :label="item"
                  :value="item"
                  v-for="item in cardComponentType"
                  :key="item + 'cardComponentType'"
                />
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="固有组件"
              v-if="cardComponentDetail.type == cardComponentType.componentList"
            >
              <el-select
                v-model="cardComponentDetail.name"
                placeholder="选择组件"
                @change="componentLoaderChange"
              >
                <el-option
                  :value="index"
                  v-for="(item, index) in componentLists"
                  :key="item.name + '_' + index"
                >
                  {{ item.compontentInfo.label + ":" + item.compontentInfo.description }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="代码"
              v-if="cardComponentDetail.type == cardComponentType.fromData"
            >
              <Codemirror
                v-model:value="cardComponentDetail.data"
                :options="cmOptions"
                border
                placeholder="test placeholder"
                :height="600"
              />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card header="组件属性" class="card">
          <el-form :model="data" v-on:submit.prevent>
            <el-form-item
              v-for="(formItem, index) in dataInputTemplate"
              :key="index + '_FormItem'"
              :label="formItem.label"
            >
              <el-input v-model="data[formItem.key]" />
            </el-form-item>
          </el-form>
        </el-card>

        <div class="BtnList">
          <el-button class="btn" type="primary" @click="close(true)">保存</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </div>
    </div>
  </span>
</template>

<script lang="ts">
import { componentLists } from "@/components/basicComponents/grid/module/gridCard/module/componentLists";
import {
  componentGetter,
  cardComponent,
  cardComponentType,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { defineComponent } from "vue";

// 引入编辑器
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";

export default defineComponent({
  name: "cardEditModal",
  components: {
    Codemirror,
  },
  props: ["detail", "gridList", "componentIndex"],
  data() {
    return {
      componentLists,
      modalControl: {
        isOpen: false,
      } as { [key: string]: any },

      data: {} as { [key: string]: any },
      dataInputTemplate: [] as Array<{
        [key: string]: any;
      }>,

      cardComponentDetail: {} as cardComponent,
      cardComponentType,

      // 代码编辑器
      cmOptions: {
        mode: "text/javascript", // Language mode
        theme: "dracula", // Theme
        lineNumbers: true, // Show line number
        smartIndent: true, // Smart indent
        indentUnit: 2, // The smart indent unit is 2 spaces in length
        foldGutter: true, // Code folding
        styleActiveLine: true, // Display the style of the selected row
      },
    };
  },
  methods: {
    /**
     * @name: getPropsData
     * @description: 载入组件数据
     * @authors: CZH
     * @Date: 2022-06-28 21:53:23
     */
    getPropsData() {
      // 拆分组件属性,设置表单数据
      this.dataInputTemplate = [];
      this.data = { ...this.detail.options.props };

      // componentList 模式属性预先加载
      if (this.detail.component.type == cardComponentType.componentList) {
        const props = componentGetter(this.detail.component, componentLists).settngDetail
          .props;
        for (let x in props) {
          this.dataInputTemplate.push({
            key: x,
            ...props[x],
          });
        }
      }

      // 获取当前组件模式
      this.cardComponentDetail = { ...this.detail.component };
      // 检查组件加载模式，设置fromData组件的初始值（假如为空）
      if (!this.cardComponentDetail.data || this.cardComponentDetail.data == "") {
        this.cardComponentDetail.data = `{
      setup(props) {
        const name = ref('小米')
        return { name }
      },
      render() {
        return h('div', { style: { fontSize: '24px' } }, '你好' + this.name)
      }
    }`;
      }

      this.$forceUpdate();
    },

    /**
     * @name: componentLoaderChange
     * @description: 判断组件加载状态&&加载模式，更新组件props输入表单
     * @authors: CZH
     * @Date: 2022-06-28 21:55:51
     */
    async componentLoaderChange() {
      const { cardComponentDetail } = this;
      let cardComponent = componentGetter(cardComponentDetail, componentLists);

      // 根据不同的组件加载模式执行对应的检查方式
      switch (cardComponentDetail.type) {
        case cardComponentType.componentList:
          // 重置输入模板
          this.dataInputTemplate = [];
          await this.$nextTick();
          for (let x in cardComponent.settngDetail.props) {
            this.dataInputTemplate.push({
              key: x,
              ...cardComponent.settngDetail.props[x],
            });
          }
          break;
        case cardComponentType.fromData:
          break;
        case cardComponentType.cusComponent:
          break;
      }
    },

    /**
     * @name: open
     * @description: 载入组件数据，之后打开编辑窗口
     * @authors: CZH
     * @Date: 2022-06-28 21:53:14
     */
    async open() {
      this.getPropsData();
      await this.$nextTick();
      this.modalControl.isOpen = true;
    },

    /**
     * @name: close
     * @description: 关闭组件编辑窗口，回填编辑后？的组件数据，目前版本会导致所有的组件重新加载
     * @authors: CZH
     * @Date: 2022-06-28 21:49:58
     * @param {*} needSave
     */
    async close(needSave = false) {
      if (needSave) {
        const gridList = [...this.gridList];
        gridList[this.componentIndex] = {
          ...this.detail,
          options: {
            ...this.detail.options,
            props: {
              ...this.detail.options.props,
              ...this.data,
            },
          },
          component: {
            ...this.detail.component,
            ...this.cardComponentDetail,
          },
        };
        this.$emit("onChange", this.componentIndex, gridList);
      }
      this.modalControl.isOpen = false;
    },

    // 一个无用的函数
    fuckNothing() {},
  },
});
</script>

<style lang="scss" scoped>
.baseModal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  //   z-index: 1000000000;
  z-index: -1;
  opacity: 0;
  top: 0px;
  left: 0px;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.5s;
  display: flex;
  justify-content: center;
  .formModalBox {
    transform: scale(0.4);
  }
}

.open {
  opacity: 1;
  z-index: 10000000000;
  .formModalBox {
    transform: scale(1);
  }
}

.formModalBox {
  transition: all 0.4s;
  position: absolute;
  width: 80vw;
  top: 10vh;
  height: 80vh;
  min-width: 800px;
  max-width: 1400px;
  border-radius: 12px;
  background: #fefefe;
  overflow-x: hidden;
  overflow-y: scroll;
  .card {
    width: calc(100% - 20px);
    height: auto;
    margin: 10px;
    border-radius: 6px;
    text-align: left;
  }
  .BtnList {
    position: relative;
    text-align: right;
    bottom: 12px;
    width: 100%;
    right: 12px;
    width: auto;
    height: auto;
    margin-top: 30px;
    .btn {
      margin-right: 12px;
    }
  }
}

.cm-s-xq-dark .CodeMirror-line::selection,
.cm-s-xq-dark .CodeMirror-line > span::selection,
.cm-s-xq-dark .CodeMirror-line > span > span::selection {
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}
</style>
