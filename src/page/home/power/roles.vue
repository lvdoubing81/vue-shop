<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片-->
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddRole">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table style="width: 100%" :data="roleList" border stripe>
                <!--展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom','vcenter',i1 === 0 ? 'bdtop' : '']"
                                v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!--一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--二级权限-->
                            <el-col :span="19">
                                <el-row v-for="(item2,i2) in item1.children" :key="item2.id"
                                        class="vcenter" :class="{bdtop : i2!==0,}">
                                    <el-col  :span="6">
                                        <el-tag  type="success"
                                                 closable @close="removeRight(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                                <el-tag  v-for="(item3,i3) in item2.children" :key="item3.id"
                                                       type="warning"
                                                         closable @close="removeRight(scope.row,item3.id)">
                                                    {{item3.authName}}
                                                </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色权限"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditRole(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="deleteRole(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini"
                                   @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--添加角色对话框-->
        <el-dialog
                title="添加角色"
                :visible.sync="addRolesDialogVisible"
                width="50%">
            <el-form :model="addRoleForm" ref="addRoleFormRef" label-width="70px">
                <el-form-item label="角色" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色权限" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole()">确 定</el-button>
                </span>
        </el-dialog>
        <!--修改角色对话框-->
        <el-dialog
                title="添加角色"
                :visible.sync="editRolesDialogVisible"
                width="50%">
            <el-form :model="editRoleForm" ref="editRoleFormRef" label-width="70px">
                <el-form-item label="角色" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色权限" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole()">确 定</el-button>
                </span>
        </el-dialog>
        <!--分配权限对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                @close="defKeys=[]"
                width="50%">
            <el-tree :data="rightList" :props="treeProps" show-checkbox
                     node-key="id" default-expand-all
                     :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
             </span>
        </el-dialog>

    </div>


</template>

<script>
    export default {
        name: "roles",
        data(){
            return{
                //添加角色表单
                addRoleForm:{
                    roleName: '',
                    roleDesc: ''
                },
                //添加角色消息框显示隐藏
                addRolesDialogVisible:false,
                //修改觉得消息框显示隐藏
                editRolesDialogVisible:false,
                //角色列表
                roleList:[],
                //所有权限列表
                rightList:[],
                //分配权限消息框显示隐藏
                setRightDialogVisible:false,
                //树形控件的属性绑定对象
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                //默认选中的节点Id值数组
                defKeys:[],
                //接下来要分配权限的角色id
                roleId:'',
                editRoleForm:{}
            }
        },
        created() {
            this.getRoleList()
        },
        methods:{
            // 获取角色列表
            getRoleList(){
                this.$http.get('roles').then(res=>{
                    this.roleList = res.data.data
                })
            },
            //显示添加角色
            showAddRole(){
                this.addRolesDialogVisible = true
            },
            //添加角色
            addRole(){
                this.$http.post('roles',this.addRoleForm).then(res=>{
                    this.$message.success('添加角色成功')
                    this.getRoleList()
                    this.addRolesDialogVisible = false
                })
            },
            //显示修改角色
            showEditRole(id){
                this.$http.get('roles/'+id).then(res=>{
                    this.editRoleForm = res.data.data
                    console.log(this.editRoleForm)
                })
                this.editRolesDialogVisible = true
            },
            //修改角色
            editRole(){
                this.$http.put('roles/'+this.editRoleForm.roleId,this.editRoleForm).then(res=>{
                    console.log(res)
                    this.$message.success('修改成功')
                    this.getRoleList()
                    this.editRolesDialogVisible = false
                })
            },
            //删除角色
            deleteRole(id){
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('roles/'+ id).then(res=>{
                        this.$message.success('删除角色成功！')
                        this.getRoleList()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            //角色权限删除
            removeRight(role,rightId){
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`roles/${role.id}/rights/${rightId}`).then(res=>{
                        if(res.data.meta.status !==200) return

                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        role.children = res.data.data
                    }).catch(err=>{
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //显示角色权限分配树形结构对话框
            showSetRightDialog(role){
                //保存当前角色id方便后续权限分配
                this.roleId = role.id
                //请求数据，树形展开
                this.$http.get('rights/tree').then(res=>{
                    this.rightList = res.data.data
                })
                //递归获取第三权限的id值
                 this.getLeafKeys(role,this.defKeys)
                //关闭信息框
                this.setRightDialogVisible = true

            },
            //循环递归获取第三权限id
            getLeafKeys(node,arr){
                //如果没有子节点，将id放入数组
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item=>
                this.getLeafKeys(item,arr))
            },
            //分配角色权限
            allotRights(){
                //获取选中节点的id，保存为数组形式
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                //拼接数组字符串，为了符合发送后端数据格式
                const idStr = keys.join(',')
                //发送请求
                this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(res=>{
                    this.$message.success('权限分配成功')
                    this.getRoleList()
                    this.setRightDialogVisible = false
                })
            }
        }
    }
</script>

<style scoped>
        .el-tag{
            margin: 7px;
        }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
</style>