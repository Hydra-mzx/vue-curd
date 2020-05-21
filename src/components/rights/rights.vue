<template>
  <div>
    <!-- @current-change="handleCurrentChange" -->
    <el-table ref="singleTable" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="authName" label="权限名称" width="150"></el-table-column>
      <el-table-column property="path" label="路径" width="150"></el-table-column>
      <el-table-column property="level" label="层级" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-if="scope.row.level == 1">二级</span>
          <span v-if="scope.row.level == 2">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getRightsList();
  },
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    getRightsList() {
      this.$myHttp({
        url: "rights/list",
        method: "get"
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.tableData = data;
        }
      });
    }
  }
};
</script>
<style>
.el-table__footer-wrapper,
.el-table__header-wrapper {
  line-height: 20px;
}
</style>