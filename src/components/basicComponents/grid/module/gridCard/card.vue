<!--
 * @Date: 2022-04-29 15:02:20
 * @LastEditors: CZH
 * @LastEditTime: 2022-06-29 08:47:37
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/card.vue
-->
<script lang="ts">
import cardBox from "./module/cardBox.vue";
import { getIcon } from "@/utils";
import { defineComponent, h, reactive, toRefs, ref } from "vue";
import { componentGetter, gridCellTemplate } from "./../dataTemplate";
import { componentLists } from "./module/componentLists";
import { ElIcon } from "element-plus";
export default defineComponent({
  name: "gridCardBox",
  emits: ["onChange", "openComponentsList"],
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
    sizeUnit: {
      type: Object,
      default: () => {
        return {};
      },
    },
    baseData: {
      type: Object,
      default: () => {
        return {} as { [key: string]: any };
      },
    },
    gridList: {
      type: Array,
      default: () => {
        return [] as Array<gridCellTemplate>;
      },
    },
  },
  methods: {},
  setup(props, context) {
    let children = props.detail.options.slots || null;
    let isLoading = ref(true);

    const { sizeUnit, detail } = toRefs(props);

    // 组件渲染函数

    // 判断动画尺寸
    const editShakeName = (size: { width: number; height: number }): string => {
      const { width, height } = size;
      const big = width > height ? width : height;
      if (big < 4) return "editShakeS_GRID_CARD_BOX";
      if (big < 8) return "editShakeM_GRID_CARD_BOX";
      return "editShakeL_GRID_CARD_BOX";
    };

    return () => [
      h(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            userSelect: "none",
            Animation: props.baseData.editable
              ? editShakeName(props.detail.gridInfo.default.size) +
                " 0.3s ease-in-out infinite"
              : "none",
          },
        },
        [
          h(
            "div",
            {
              style: {
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                background: "rgba(255,255,255,1)",
                borderRadius: "12px",
                zIndex: isLoading.value ? 100000 : -1,
                // zIndex: -1,
                display: "flex",
              },
            },
            [
              h(
                ElIcon,
                {
                  style: {
                    top: "50%",
                    left: "50%",
                    margin: "-" + sizeUnit.value.blockSize * 0.25 + "px",
                    fontSize: sizeUnit.value.blockSize * 0.5 + "px",
                  },
                  class: "is-loading",
                },
                () => h(getIcon("Loading"))
              ),
            ]
          ),
          h(cardBox, {
            style: {
              width: "100%",
              height: "100%",
              zIndex:
                props.baseData.editable && !props.detail.options.isSettingTool
                  ? "100000000000"
                  : "-1",
            },
            blockSize: props.sizeUnit.blockSize,
            detail: props.detail,
            sizeUnit: props.sizeUnit,
            onOnChange: (
              value: { [key: string]: any },
              options: { [key: string]: any }
            ) => {
              context.emit("onChange", value, options);
            },
          }),
          h(
            componentGetter(props.detail.component, componentLists).component,
            {
              onOnChange: (key: string, value: any, options: { [key: string]: any }) => {
                context.emit("onChange", key, value, options);
              },
              onReady: (e = false) => {
                isLoading.value = e;
              },
              baseData: props.baseData,
              sizeUnit: props.sizeUnit,
              gridList: props.gridList,
              ...props.detail.options.props,
            },
            children ? children(props, context) : null
          ),
        ]
      ),
    ];
  },
});
</script>

<style>
@keyframes editShakeL_GRID_CARD_BOX {
  0% {
    transform: rotate(0deg);
  }
  33% {
    transform: rotate(-0.2deg);
  }
  66% {
    transform: rotate(0.2deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes editShakeS_GRID_CARD_BOX {
  0% {
    transform: rotate(0deg);
  }
  33% {
    transform: rotate(-1deg);
  }
  66% {
    transform: rotate(1deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes editShakeM_GRID_CARD_BOX {
  0% {
    transform: rotate(0deg);
  }
  33% {
    transform: rotate(-0.5deg);
  }
  66% {
    transform: rotate(0.5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
