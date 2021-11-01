<template>
  <div class="fu-table">
    <div class="search">
      <el-form
        :inline="true"
        :model="searchForm"
        size="small"
        class="demo-form-inline"
      >
        <el-form-item
          :label="item.label + ': '"
          :prop="item.prop"
          v-for="(item, index) in searchItem(option.column)"
          :key="item.prop + '_' + index"
        >
          <el-input
            v-model="searchForm[item.prop]"
            :placeholder="'请填写' + item.label"
          ></el-input>
        </el-form-item>
        <slot name="searchOtherForm"></slot>
        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmitSearch">查询</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="table">
      <el-table
        :show-header="option.showHeader"
        :data="data"
        style="width: 100%"
        :border="option.border"
        :stripe="option.stripe"
        :row-class-name="rowClassNameType"
        :height="option.height"
        :max-height="option.maxHeight"
        :highlight-current-row="option.highlightCurrentRow"
        :row-key="option.rowKey"
        :tree-props="option.treeProps"
        @current-change="handleTableCurrentChange"
        @selection-change="handleTableSelectionChange"
      >
        <slot name="selection">
          <el-table-column
            type="selection"
            width="44"
            align="center"
            v-if="option.selection"
          ></el-table-column>
        </slot>
        <el-table-column
          v-if="option.serialNumber"
          type="index"
          width="54"
          align="center"
          label="序号"
        ></el-table-column>
        <template v-for="(columnItem, index) in option.column">
          <el-table-column
            v-if="columnItem.columnItemSlot"
            :key="columnItem.prop + '_' + index"
            :prop="columnItem.prop"
            :label="columnItem.label"
            :fixed="columnItem.fixed"
            :align="option.align || columnItem.align"
            :sortable="columnItem.sortable"
            :filters="columnItem.filters"
            :filter-method="columnItem.filterMethod"
            :width="columnItem.width"
            :show-overflow-tooltip="columnItem.tooltip"
          >
            <slot :name="columnItem.columnItemSlot"></slot>
          </el-table-column>

          <el-table-column
            v-else-if="columnItem.slot"
            :key="columnItem.prop + '_' + index"
            :prop="columnItem.prop"
            :label="columnItem.label"
            :fixed="columnItem.fixed"
            :align="option.align || columnItem.align"
            :sortable="columnItem.sortable"
            :filters="columnItem.filters"
            :filter-method="columnItem.filterMethod"
            :width="columnItem.width"
            :show-overflow-tooltip="columnItem.tooltip"
          >
            <template #default="{ row, $index }">
              <slot :name="columnItem.slot" :data="row"></slot>
              <span
                v-if="columnItem.copy"
                class="iconfont icon-fuzhi"
                title="复制"
                :class="columnItem.prop + '_' + $index"
                :data-clipboard-text="row[columnItem.prop]"
                @click="copyData(columnItem.prop + '_' + $index)"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="columnItem.prop + '_' + index"
            :prop="columnItem.prop"
            :label="columnItem.label"
            :fixed="columnItem.fixed"
            :align="option.align || columnItem.align"
            :sortable="columnItem.sortable"
            :filters="columnItem.filters"
            :filter-method="columnItem.filterMethod"
            :width="columnItem.width"
            :show-overflow-tooltip="columnItem.tooltip"
          >
            <template #header>
              <el-tooltip placement="top">
                <template slot="content">
                  <span v-html="columnItem.prefixIconContent"></span>
                </template>
                <i
                  class="prefix-icon"
                  :class="[
                    columnItem.prefixIcon.startsWith('icon-') ? 'iconfont' : '',
                    columnItem.prefixIcon,
                  ]"
                  v-if="columnItem.prefixIcon"
                ></i>
              </el-tooltip>

              <span>{{ columnItem.label }}</span>
              <el-tooltip placement="top">
                <template slot="content">
                  <span v-html="columnItem.suffixIconContent"></span>
                </template>
                <i
                  class="suffix-icon"
                  v-if="columnItem.suffixIcon"
                  :class="[
                    columnItem.suffixIcon.startsWith('icon-') ? 'iconfont' : '',
                    columnItem.suffixIcon,
                  ]"
                ></i>
              </el-tooltip>
            </template>
            <template #default="{ row, $index }">
              <span>{{ row[columnItem.prop] }}</span>
              <span
                v-if="columnItem.copy"
                class="iconfont icon-fuzhi"
                title="复制"
                :class="columnItem.prop + '_' + $index"
                :data-clipboard-text="row[columnItem.prop]"
                @click="copyData(columnItem.prop + '_' + $index)"
              ></span>
            </template>
            <!-- <el-table-column
            v-for="items in columnItem.columnItem"
            :key="items.prop"
            :prop="items.prop"
            :label="items.label"
            :fixed="items.fixed"
            :align="items.align"
            :sortable="items.sortable"
          ></el-table-column> -->
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div
      class="pagination"
      :style="{ 'text-align': option.pagination.direction }"
    >
      <el-pagination
        :small="option.pagination.small"
        :background="option.pagination.background"
        :hide-on-single-page="page.current <= 1"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[10, 200, 300, 400]"
        :page-size="page.size"
        :layout="
          option.pagination.layout || 'total, sizes, prev, pager, next, jumper'
        "
        :total="page.total"
        :prev-text="option.pagination.prevText"
        :next-text="option.pagination.nextText"
        :disabled="option.pagination.disabled"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
export default {
  props: {
    option: Object,
    data: Array,
    rowClassName: Function | String,
    page: Object,
    searchForm: Object,
  },
  model: {
    prop: "searchForm",
    event: "change",
  },
  data() {
    return {};
  },
  computed: {
    searchItem() {
      return (array) => {
        return array.filter((item) => item.search);
      };
    },
  },
  mounted() {
    console.log(this.data);
    console.log(this.option);
  },
  methods: {
    copyData(row) {
      let clipboard = new Clipboard(`.${row}`);
      clipboard.on("success", (e) => {
        console.log(e);
        this.$notify({
          title: "复制成功",
          message: e.text,
          type: "success",
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$notify({
          title: "复制失败",
          message: e.text,
          type: "success",
        });
        clipboard.destroy();
      });
    },
    /* 搜索 */
    // onSubmitSearch() {
    //   console.log(this.searchForm);
    // },
    // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
    rowClassNameType({ row, rowIndex }) {
      if (typeof this.rowClassName === "function") {
        return this.rowClassName({ row, rowIndex });
      } else {
        return this.rowClassName;
      }
    },
    // 单选
    handleTableCurrentChange(val) {
      this.$emit("current-change", val);
    },
    // 多选
    handleTableSelectionChange(val) {
      this.$emit("selection-change", val);
    },
    // selectableFunc(row, index) {
    //   if (index === 0) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    handleSizeChange(val) {
      this.page.size = val;
      console.log(this.page);
      this.$emit("update:page", this.page); // 更新父组件分页current
      this.$emit("get-pagelist");
    },
    handleCurrentChange(val) {
      this.page.current = val;
      console.log(this.page);
      this.$emit("update:page", this.page); // 更新父组件分页current
      this.$emit("get-pagelist");
    },
  },
};
</script>

<style lang="scss" scoped>
.fu-table {
  .prefix-icon {
    margin-right: 8px;
  }
  .suffix-icon {
    margin-left: 8px;
  }
  .pagination {
    margin-top: 20px;
  }
  .icon-fuzhi {
    cursor: pointer;
    margin-left: 6px;
    &:hover {
      color: rgb(64, 158, 255);
    }
  }
}
</style>
