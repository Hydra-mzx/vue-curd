<template>
  <div>
    <el-button class="addrole" type="info" @click="roleShow" plain>添加角色</el-button>
    <!-- 表格主体 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope" class="roleinfo">
          <el-row v-for="(item,key0) in scope.row.children" :key="key0">
            <el-col :span="6">
              <el-tag closable>{{ item.authName }}</el-tag>>
            </el-col>
            <el-col :span="18">
              <el-row v-for="(item1,key1) in item.children" :key="key0">
                <el-col :span="6">
                  <el-tag closable type="success">{{ item1.authName }}</el-tag>>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    v-for="(item2,key2) in item1.children"
                    closable
                    :key="key2"
                    type="info"
                    @close="deleTag(item1,key2,scope.row.id,item2.id)"
                  >{{ item2.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- <span v-for="item in scope.row.children">{{item.authName}} </span> -->
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" prop>
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click.stop="editShow(scope)"
            plain
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click.stop="deleteRole(scope.row.id)"
            plain
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            @click="rightisShow(scope.row)"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- :before-close="handleClose" -->
    <el-dialog title="分配权限" :visible.sync="rightShow" width="30%">
      <!-- :default-expanded-keys="[2, 3]        
      -->
      <el-tree
        ref="tree"
        :data="rightsTree"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-expand-all="true"
        :default-checked-keys="checkedArr"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightShow = false">取 消</el-button>
        <el-button type="primary" @click="rightPost">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleShow">
      <el-form :model="roleAddData" :rules="rules" ref="roleAddData">
        <el-form-item label="角色名称" label-width="200px" prop="roleName">
          <el-input v-model="roleAddData.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="200px">
          <el-input v-model="roleAddData.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="addRolePost">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="添加角色" :visible.sync="editRoleShow">
      <el-form :model="roleEditData" :rules="rules"  ref="roleEditData">
        <el-form-item label="角色名称" label-width="200px" prop="roleName">
          <el-input v-model="roleEditData.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="200px">
          <el-input v-model="roleEditData.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="editRolePut">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getRoleList();
  },
  data() {
    return {
      rightShow: false,
      tableData: [],
      rightsTree: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkedArr: [],
      roleId: 0,
      addRoleShow: false,
      roleAddData: {},
      editRoleShow: false,
      roleEditData: {},
      rules: {
        roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      }
    };
  },
  methods: {
    getRoleList() {
      this.$myHttp({
        url: "roles",
        method: "get"
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          //console.log(data);
          this.tableData = data;
        }
      });
    },
    editShow(scope) {
      this.editRoleShow = true;
      this.roleEditData = scope.row;
    },
    editRolePut() {
      this.$refs.roleEditData.validate(res => {
        // 如果有错误，直接停止代码执行
        if (res) {
          return;
        }
      });
      let id = this.roleEditData.id;
      let roleName = this.roleEditData.roleName;
      let roleDesc = this.roleEditData.roleDesc;
      this.$myHttp({
        url: `roles/${id}`,
        method: "put",
        data: { roleName, roleDesc }
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else {
          this.$message.error("修改失败");
          this.getRoleList();
        }
        this.getRoleList();
        this.editRoleShow = false;
      });
    },
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //执行删除
          this.$myHttp({
            url: `roles/${id}`,
            method: "delete"
          }).then(backdata => {
            let { data, meta } = backdata.data;
            if (meta.status == 200) {
              this.getRoleList();
              this.$message({
                message: "删除角色成功",
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    rightisShow(row) {
      //获取选中的 权限
      this.roleId = row.id;
      this.checkedArr = [];
      var arrRight = [];
      var arr = row.children;
      //只循环 获取第三级的选中id
      arr.forEach(item => {
        item.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arrRight.push(item3.id);
          });
        });
      });
      this.checkedArr = arrRight;
      // 权限分配
      // 获取列表
      this.$myHttp({
        url: `rights/tree`,
        method: "get"
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          //console.log(data);
          this.rightsTree = data;
        }
      });
      //打开显示面板
      this.rightShow = true;
    },
    rightPost() {
      //选中
      let a = this.$refs.tree.getCheckedKeys();
      //半选中
      let b = this.$refs.tree.getHalfCheckedKeys();
      let rids = a.concat(b).join();
      console.log(rids);
      this.$myHttp({
        url: `roles/${this.roleId}/rights`,
        method: "post",
        data: { rids }
      }).then(backdata => {
        let { meta } = backdata.data;
        if (meta.status == 200) {
          this.$message({ message: meta.msg, type: "success" });
          this.rightShow = false;
          this.getRoleList();
        }
      });
    },
    deleTag(item, key, roleId, rightId) {
      this.$myHttp({
        url: `roles/${roleId}/rights/${rightId}`,
        method: "delete"
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.$message({ message: meta.msg, type: "success" });
          item.children.splice(key, 1);
        }
      });
    },
    roleShow() {
      this.addRoleShow = true;
    },
    addRolePost() {
      // console.log(this.roleAddData);
      this.$refs.roleAddData.validate(res => {
        // 如果有错误，直接停止代码执行
        if (res) {
          return;
        }
      });
      this.$myHttp({
        url: `roles`,
        method: "post",
        data: this.roleAddData
      }).then(backdata => {
        let { data, meta } = backdata.data;
        if (meta.status == 201) {
          this.$message({ message: meta.msg, type: "success" });
          this.getRoleList();
          this.roleAddData = {};
          this.addRoleShow = false;
        }
      });
    }
  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-main {
  line-height: 20px;
}
.addrole {
  float: left;
}
.el-tag {
  margin: 5px;
}
</style>