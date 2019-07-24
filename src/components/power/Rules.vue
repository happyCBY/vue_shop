<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table style="width: 99.9%" :data="roleList" border stripe>
        <!-- 权限描述 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0?'bdtop':'','flex_center'] "
              v-for="(attr,i1) in scope.row.children"
              :key="attr.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  :disable-transitions="false"
                  @close="delUserPower(scope.row,attr.id)"
                >{{attr.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item,i2) in attr.children"
                  :key="item.id"
                  :class="[i2 !== attr.children.length-1?'bdbottom':'','flex_center']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      :disable-transitions="false"
                      @close="delUserPower(scope.row,item.id)"
                      type="success"
                    >{{item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      class="mgright"
                      v-for="ele in item.children"
                      :key="ele.id"
                      closable
                      :disable-transitions="false"
                      @close="delUserPower(scope.row,ele.id)"
                      type="warning"
                    >{{ele.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="small"
              type="warning"
              icon="el-icon-star-off"
              @click="setUserNewPower(scope.row)"

            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="提示" :visible.sync="showSetNewPower" width="50%" @close = "clearCheckpedList">
      <span>这是一段信息</span>

      <!-- 树形控件 -->
      <el-tree
        :data="roleTreeList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkpedList"
        :props="defaultProps"
		ref="getCheckedId"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetNewPower = false">取 消</el-button>
        <el-button type="primary" @click="updateUserPower()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    created: function() {
        this.getRolesList()
    },
    data() {
        return {
			roleList: [],
			//显示分配权限的界面按钮
			showSetNewPower: false,
			//获得树形权限列表
			roleTreeList: [],
			//拥有的权限的id集合
			checkpedList: [],
			//树形图设置
            defaultProps: {
				//设置以children属性为子树，
				children: 'children',
				//设置显示出来的名字为数组中的authName属性
                label: 'authName'
			},
			roleID: ""
        }
    },
    methods: {
        //获的角色列表
        getRolesList: async function() {
            var data = await this.$http.get('roles')
            if (data.meta.status != 200) {
                return this.message.error('获取用户列表失败')
            }
			this.roleList = data.data
        },
        //删除用户权限
        delUserPower: async function(row, powerID) {
            var confirmRusult = await this.$confirm(
                '此操作将删除用户权限, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)

            if (confirmRusult === 'cancel') {
                return this.$message.warning('已取消删除权限操作')
            }

            var data = await this.$http.delete(
                `roles/${row.id}/rights/${powerID}`
            )

            this.roleList.forEach((element, index) => {
                if ((element.id = row.id)) {
                    return (this.roleList[index].children = data.data)
                }
            })
        },
        //分配用户权限
        setUserNewPower: async function(powerList) {
			this.roleID = powerList.id;
            var list = await this.$http.get('rights/tree')
            var data = await this.$http.get('roles')
            if (list.meta.status != 200) {
                return this.$message.error('获取权限列表失败')
            }
            this.roleTreeList = list.data

            //遍历数组把所有id拿出来
			this.getPowerID(powerList.children)
            this.showSetNewPower = true
		},

		//遍历数组取出拥有权限的id
		getPowerID: function (arr){
			arr.forEach(attr => {
				if(attr.children) {
					this.getPowerID(attr.children);
				}else {
					this.checkpedList.push(attr.id);
				}
			})
		},
		//对话框关闭的时候清空checkpedList数组
		clearCheckpedList: function (){
			this.checkpedList = [];
		},
		//修改用户权限
		updateUserPower: async function (){
			var arr = [
				...this.$refs.getCheckedId.getCheckedKeys(),
				...this.$refs.getCheckedId.getHalfCheckedKeys()
			]
			arr = arr.join(",")
			var data = await this.$http.post(`roles/${this.roleID}/rights`,{rids:arr});
			console.log(data);
			if(data.meta.status !== 200) {
				this.$message.error("用户授权失败")
			}
			this.$message.success("用户授权成功")
			this.getRolesList()
			this.showSetNewPower = false
		}
    }
}
</script>
<style lang='less' scoped>
.el-table {
    margin-top: 20px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
    // padding: 10px 0;
}
.mgright {
    margin-right: 10px;
}
.el-tag {
    margin: 7px;
}
.flex_center {
    display: flex;
    align-items: center;
}
</style>