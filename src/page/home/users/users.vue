<template>

        <div>
            <!--面包屑导航区域-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!--卡片-->
            <el-card class="box-card">
                <!--搜索与添加区域-->
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable
                        @clear="getUserList">
                            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                    </el-col>
                </el-row>
                <!--用户列表-->
                <el-table style="width: 100%" :data="userList" border stripe>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="username" label="姓名"></el-table-column>
                        <el-table-column prop="email" label="邮箱"></el-table-column>
                        <el-table-column prop="mobile" label="电话"></el-table-column>
                        <el-table-column prop="role_name" label="角色"></el-table-column>
                        <el-table-column  label="状态">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                    <el-table-column label="操作" width="180px">
                        <template slot-scope="scope">
                            <!--修改按钮-->
                            <el-tooltip effect="dark" content="修改"  placement="top" >
                                <el-button type="primary" size="mini" @click="showEditDialog(scope.row.id)">
                                    <i class="el-icon-edit"></i>
                                </el-button>
                            </el-tooltip>
                            <!--删除按钮-->
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <el-button type="danger" size="mini" @click="deleteUser(scope.row.id)">
                                    <i class="el-icon-delete"></i>
                                </el-button>
                            </el-tooltip>
                            <!--分配角色按钮-->
                            <el-tooltip effect="dark" content="分配角色" placement="top">
                                <el-button type="warning" size="mini" @click="showSetRole(scope.row)">
                                    <i class="el-icon-setting"></i>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页区域-->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[1, 2, 5]"
                        :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </el-card>
            <!--添加用户对话框-->
            <el-dialog
                    @close="addDialogClose"
                    title="添加用户"
                    :visible.sync="addDialogVisible"
                    width="50%">
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>
            <!--修改用户对话框-->
            <el-dialog
                    @close="editDialogClose"
                    title="修改用户"
                    :visible.sync="editDialogVisible"
                    width="50%">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
                </span>
            </el-dialog>
            <!--分配角色对话框-->
            <el-dialog
                    title="分配角色"
                    :visible.sync="setRoleDialogVisible"
                    width="50%">
                <el-form :model="setForm" ref="setFormRef">
                    <el-form-item label="当前的用户">
                        {{setForm.username}}
                    </el-form-item>
                    <el-form-item label="当前的角色">
                        {{setForm.role_name}}
                    </el-form-item>
                    <el-form-item label="分配新角色">
                        <el-select  v-model="selectedRoleId" placeholder="选择新角色">
                            <el-option v-for="item in roleList" :key="item.id"
                                       :label="item.roleName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setRole">确 定</el-button>
                </span>
            </el-dialog>
        </div>
</template>

<script>
    export default {
        name: "users",
        data(){
            //验证邮箱
            var checkEmail= (rule,value,cb) =>{
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if(regEmail.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法邮箱'))
            }
            //验证手机号
            var checkMobile= (rule,value,cb) =>{
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if(regMobile.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法手机号'))
            }

            return{
                queryInfo:{
                    //查询对象
                    query:'',
                    //当前页数
                    pagenum: 1,
                    //当前页面信息数
                    pagesize: 2
                },
                //用户信息
                userList:[],
                //信息总数
                total: 0,
                //添加用户消息框的显示隐藏
                addDialogVisible: false,
                //添加用户的表单数据
                addForm:{
                    username:'',
                    password:'',
                    email: '',
                    mobile:''
                },
                //添加用户的表单验证规则
                addFormRules:{
                    username:[{ required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    email:[
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail,trigger: 'blur'}
                    ],
                    mobile:[
                        { required: true, message: '请输入手机', trigger: 'blur' },
                        { validator: checkMobile,trigger: 'blur'}
                    ]
                },
                //修改用户消息框的显示隐藏
                editDialogVisible:false,
                //修改用户表单的验证规则
                editFormRules:{
                    email:[
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail,trigger: 'blur'}
                    ],
                    mobile:[
                        { required: true, message: '请输入手机', trigger: 'blur' },
                        { validator: checkMobile,trigger: 'blur'}
                    ]
                },
                //查询到的用户对象
                editForm:{},
                //用户角色分配对话框显示隐藏
                setRoleDialogVisible:false,
                //需要分配角色的用户的信息
                setForm:{},
                //所有角色信息
                roleList:[],
                //已经选中的角色id
                selectedRoleId:''
            }
        },
        created() {
            this.getUserList()
        },
        methods:{
            //获取用户列表
            getUserList(){
                this.$http.get('users',{ params: this.queryInfo}).then(res=>{
                    this.userList = res.data.data.users
                    this.total = res.data.data.total
                })
            },
            //设置新的页面条数
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            //页面页数跳转
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            //更新用户状态
            userStateChange(userInfo){
                this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(res =>{
                    this.$message.success('更新成功')
                })
            },
            //重置新增用户对话框
            addDialogClose(){
                this.$refs.addFormRef.resetFields()
            },
            //添加用户
            addUser(){
                this.$refs.addFormRef.validate(valid =>{
                    if(!valid) return
                    this.$http.post('users',this.addForm).then(res=>{
                        console.log(res)
                        if(res.status !== 200){
                            return  this.$message.error("添加用户失败！")
                        }else {
                            this.$message.success("添加用户成功！")
                        }

                        //关闭添加用户框
                        this.addDialogVisible = false
                        //刷新列表
                        this.getUserList()
                    })
                })
            },
            //令修改用户消息框显示，并通过选中用户的id查询该用户信息保存
            showEditDialog(id){
                this.$http.get('users/' + id).then(res=>{
                    if (res.status !== 200){
                        return this.$message.error("查询用户信息失败")
                    }
                    this.editForm = res.data.data
                    this.editDialogVisible=true
                })
            },
            editDialogClose(){
                this.$refs.editFormRef.resetFields()
            },
            // 用户修改
            editUser(){
                this.$refs.editFormRef.validate(valid=>{
                    if(!valid)return
                    this.$http.put('users/'+ this.editForm.id,this.editForm).then(res=>{
                        console.log(res)
                        if(res.data.meta.status !==200){
                            return this.$message.error('修改失败！')
                        }
                        this.$message.success('修改成功！')
                        this.getUserList()
                        this.editDialogVisible = false
                    })

                })
            },
            //删除用户
            deleteUser(id){
               this.$confirm('此操作将永久删除该用户, 是否继续?','提示',{
                   confirmButtonText:'确定',
                   cancelButtonText:'取消',
                   type:'warning'
               }).then(() => {
                   console.log(id)
                   this.$http.delete('users/'+id).then(res=>{
                       if(res.data.meta.status!==200){
                           return this.$message.error('删除失败')
                       }
                       this.$message.success('删除成功')
                       this.getUserList()
                       }
                   )

               }).catch(() => {
                   this.$message({
                       type: 'info',
                       message: '已取消删除'
                   });
               });
            },
            //分配角色
            showSetRole(userInfo){
                this.setForm = userInfo
                //获取所有角色列表
                this.$http.get('roles').then(res=>{
                    this.roleList = res.data.data
                    console.log(this.roleList)
                })
                this.setRoleDialogVisible = true
            },
            setRole(){
                this.$http.put(`users/${this.setForm.id}/role`,{rid:this.selectedRoleId}).then(res=>{
                    console.log(res)
                })
            }

        }
    }
</script>

<style scoped>

</style>