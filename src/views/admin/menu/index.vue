<template>
  <div class="menu">
    <!-- <my-table></my-table> -->
  </div>
</template>

<script>
import MyTable from "@/components/Table/index.vue";
import { getPage } from '@/api/menu'
export default {
  components: {
    MyTable,
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      options: {
        // showHeader: true,
        selection: false,
        serialNumber: true,
        border: true, // 边框
        stripe: false, // 斑马纹
        pagination: true, // 分页
        paginationDirection: "center",
        isPaginationColor: false,
        // height: 200,
        // maxHeight: 200,
        highlightCurrentRow: true, // 设置单选-同 singleCurrentChange 事件搭配使用
        treeProps: { children: "children", hasChildren: "hasChildren" },
        rowKey: "id",
        column: [
          {
            label: "菜单名称",
            prop: "name",
          },
          {
            label: "图标",
            prop: "icon",
            slot: "icon",
          },
          { label: "排序", prop: "sort" },
          { label: "url", prop: "path" },
          { label: "组件路径", prop: "component" },
          { label: "类型", prop: "type" },
          { label: "菜单显隐", prop: "hidden" },
          { label: "路由缓冲", prop: "keepAlive" },
          { label: "权限标识", prop: "permission" },
          {
            label: "操作",
            prop: "operate",
            slot: "operate",
            width: "188",
            align: "center",
          },
        ],
      },
    };
  },
  created() {
    this.getPageData()
  },
  methods: {
    async getPageData() {
      const res = await getPage()
      console.log(res);
    },
  },
};
</script>

<style lang="scss" scoped></style>
