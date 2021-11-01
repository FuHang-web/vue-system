<template>
  <div class="user container">
    <el-card>
      <my-table
        :option="options"
        :data="tableData"
        :page="page"
        @get-pagelist="getPageList"
        v-loading="tableLoading"
      >
        <template #account_status="{ data: row }">
          <el-switch
            v-model="row.account_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="正常"
            inactive-text="锁定"
            active-value="0"
            inactive-value="9"
          >
          </el-switch>
        </template>
      </my-table>
    </el-card>
  </div>
</template>

<script>
import MyTable from "@/components/Table/index.vue";
import { getUserPage } from "@/api/user";
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
        align: 'center',
        // height: 500,
        // maxHeight: 500,
        highlightCurrentRow: true, // 设置单选-同 singleCurrentChange 事件搭配使用
        treeProps: { children: "children", hasChildren: "hasChildren" },
        rowKey: "id",
        column: [
          {
            label: "用户名称",
            prop: "username",
            copy: true,
          },
          { label: "真实姓名", prop: "real_name" },
          { label: "微信昵称", prop: "nick_name" },
          { label: "性别", prop: "sex" },
          { label: "头像", prop: "url" },
          { label: "用户类型", prop: "user_attribute" },
          {
            label: "帐号状态",
            prop: "account_status",
            slot: "account_status",
            width: '150'
          },
          {
            label: "操作",
            prop: "operate",
            slot: "operate",
            width: "188",
            align: "center",
          },
        ],
        pagination: {
          background: true,
          direction: "center",
          pageSizes: [10, 200, 300, 400],
          small: false,
          layout: "total, sizes, prev, pager, next, jumper",
          prevText: "",
          nextText: "",
          disabled: false,
        },
      },
      page: {
        size: 10,
        current: 1,
        total: 0,
      },
    };
  },
  created() {
    this.getPageList();
  },
  methods: {
    async getPageList() {
      this.tableLoading = true;
      const res = await getUserPage(
        Object.assign(
          {
            current: this.page.current,
            size: this.page.size,
          }
          // this.searchForm
        )
      );
      this.tableLoading = false;
      if (res.code !== 200) {
        return this.$message.error(res.msg || "请求失败");
      }
      console.log(res);
      this.tableData = res.data.rows;
      this.page.total = res.data.count || 0;
    },
  },
};
</script>

<style lang="scss" scoped></style>
