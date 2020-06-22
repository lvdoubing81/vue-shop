<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>

            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCate">添加分类</el-button>
                </el-col>
            </el-row>
            <!--表单-->
            <el-table
                    :data="catelist"
                    style="width: 100%;margin-bottom: 20px;"
                    stripe
                    row-key="cat_id"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    border>
                <el-table-column
                        prop="cat_name"
                        label="分类名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="是否有效">
                    <template slot-scope="scope">
                        <i class="el-icon-error cerr " v-if="scope.row.cat_deleted"></i>
                        <i class="el-icon-success cblue" v-else></i>
                    </template>
                </el-table-column>
                <el-table-column
                        label="排序">
                    <template slot-scope="scope">
                        <el-tag closable v-if="scope.row.cat_level == 0">一级</el-tag>
                        <el-tag closable type="success" v-else-if="scope.row.cat_level ==1">二级</el-tag>
                        <el-tag closable type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>
                        <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
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
        <!--添加分类消息框-->
        <el-dialog
                @close="addCateFormClear"
                title="添加分类"
                :visible.sync="addCatDialogVisible"
                width="50%">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                            size="mini"
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChange"  clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "categories",
        data(){
            return{
                queryInfo:{
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                // 分类列表
                catelist:[],
                // 页数总数
                total:'',
                // 新增消息框显示隐藏
                addCatDialogVisible:false,
                //新增表单
                addCateForm:{
                    cat_name:'',
                    cat_pid:0,
                    cat_level:0
                },
                //验证规则
                addCateFormRules:{
                    cat_name:[{required: true, message: '请输入分类名称', trigger: 'blur' },]
                },
                //父分类表单
                parentCateList:[],
                //级联选择器设置
                cascaderProps:{
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    checkStrictly:true
                },
                //select选中value值
                selectedKeys:[]
            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            // 获取分类数据
            getCateList(){
                this.$http.get('categories',{params: this.queryInfo}).then(res=>{
                    this.catelist = res.data.data.result
                    this.total =  res.data.data.total
                })
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            /*消息框显示*/
            showAddCate(){
                this.getParentCateList()
                this.addCatDialogVisible = true

            },
            // 获取父类
            getParentCateList(){
                this.$http.get('categories',{params:{ type:2 }} ).then(res=>{
                    this.parentCateList = res.data.data
                })
            },
            // 父类选择改变
            parentCateChange(){
                if (this.selectedKeys.length>0){
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1],
                        this.addCateForm.cat_level = this.selectedKeys.length
                    return
                }else {
                    this.addCateForm.cat_pid = 0,
                        this.addCateForm.cat_level = 0
                }
            },
            // 确认添加
            addCate(){

                this.$refs.addCateForm.validate(valid=>{
                    if(!valid) return
                    this.$http.post('categories',this.addCateForm).then(res=>{
                        this.$message.success("添加角色成功！")
                        this.getCateList()
                        this.addCatDialogVisible = false
                    })
                })

            },
            // 重置表单数据
            addCateFormClear(){
                this.$refs.addCateForm.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_pid = 0,
                this.addCateForm.cat_level = 0
            }
        }
    }
</script>

<style scoped>
    .cblue{
        color: rgba(0, 136, 255, 0.96);
    }
    .cerr{
        color: rgba(255, 38, 0, 0.96);
    }
</style>