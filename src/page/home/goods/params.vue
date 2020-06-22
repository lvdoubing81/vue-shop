<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片-->
        <el-card class="box-card">
            <el-alert
                    show-icon
                    title="注意：只允许为第三级分类设置参数"
                    type="warning"
                    :closable="false">
            </el-alert>
            <!--分类选择-->
            <el-row class="mar-bt">
                <el-col>
                    <span class="mar-right">设置商品参数:</span>
                    <el-cascader
                            v-model="selectedKeys"
                            :options="cateList"
                            :props="cascaderProps"
                            @change="selectedChange"></el-cascader>
                </el-col>
            </el-row>

            <!--tabs 页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!--动态参数页面-->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" @click="showAddAttr" :disabled="isBtnDisabled">添加参数</el-button>
                    <!--动态参数表格-->
                    <el-table :data="manyTableData" border>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag class="mar-right"
                                        v-for="(item,i) in scope.row.attr_vals" :key="i"
                                        closable @close="removeParams(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="addAttrValInputVisible"
                                        v-model="tagInputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag"
                                           size="small" @click="showInput">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!--修改按钮-->
                                    <el-button type="primary" size="mini">
                                        <i class="el-icon-edit"></i>修改
                                    </el-button>
                                <!--删除按钮-->
                                    <el-button type="danger" size="mini" >
                                        <i class="el-icon-delete"></i>删除
                                    </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!--静态参数页面-->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" @click="showAddAttr"
                               :disabled="isBtnDisabled">添加属性</el-button>
                    <!--静态属性表格-->
                    <el-table :data="onlyTableData" border>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag class="mar-right"
                                        v-for="(item,i) in scope.row.attr_vals" :key="i"
                                        closable @close="removeParams(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="addAttrValInputVisible"
                                        v-model="tagInputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag"
                                           size="small" @click="showInput">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!--修改按钮-->
                                <el-button type="primary" size="mini">
                                    <i class="el-icon-edit"></i>修改
                                </el-button>
                                <!--删除按钮-->
                                <el-button type="danger" size="mini" >
                                    <i class="el-icon-delete"></i>删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <!--添加参数文本框-->
            <el-dialog
                    @close="clearDialog"
                    :title= "titleTxt"
                    :visible.sync="addAtrrDialogVisible"
                    width="50%">
                <el-form ref="addAttrForm" :model="addAttrForm" :rules="addAttrFormRules">
                    <el-form-item :label="titleTxt" prop="attr_name">
                        <el-input v-model="addAttrForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addAtrrDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addAttr">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>

</template>

<script>
    export default {
        name: "params",
        data(){
            return{
                // 分类列表
                cateList:[],
                // selected选中值
                selectedKeys:[],
                // 级联选择器设置
                cascaderProps:{
                    expandTrigger:'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // tabs选中
                activeName: 'many',
                // 动态参数数据
                manyTableData:[],
                // 静态属性数据
                onlyTableData:[],
                addAtrrDialogVisible: false,
                // 添加表单对象
                addAttrForm:{
                    attr_name: ''
                },
                // 添加表单验证规则
                addAttrFormRules:{
                    attr_name:[{ required: true, message: '请输入用户名', trigger: 'blur' }]
                },
                // 属性value文本框显示隐藏
                addAttrValInputVisible:false,
                tagInputValue:''
            }
        },
        created() {
            this.getCateList()
        },
        computed:{
            // 按钮是否可选中
            isBtnDisabled(){
                if(this.selectedKeys.length !==3){
                    return true
                }else {
                    return false
                }
            },
            // 选中的第三级分类的id
            cateId(){
                if (this.selectedKeys.length === 3){
                    return this.selectedKeys[2]
                }else {
                    return null
                }
            },
            titleTxt(){
                if(this.activeName === 'many'){
                    return '动态参数'
                }else {
                    return  '静态属性'
                }
            }
        },
        methods:{
            // 获取分类
            getCateList(){
                this.$http.get('categories').then(res=>{
                    this.cateList = res.data.data
                })
            },
            selectedChange(){
                this.getParamsData()
            },
            handleClick(){
                this.getParamsData()
            },
            // 获取参数
            getParamsData(){
                if(this.selectedKeys.length !== 3){
                    this.selectedKeys = []
                    this.manyTableData= []
                    this.onlyTableData= []
                    return

                }else {
                    this.$http.get(`categories/${this.cateId}/attributes`,
                        {params:{sel:this.activeName}} ).then(res=>{
                        res.data.data.forEach(item=>{
                            item.attr_vals = item.attr_vals ? item.attr_vals.split(' '): []
                        })
                        if(this.activeName === 'many'){
                            this.manyTableData = res.data.data
                        }else {
                            this.onlyTableData = res.data.data
                        }
                    })
                }
            },
            showAddAttr(){
                this.addAtrrDialogVisible = true
            },
            clearDialog(){
                    this.$refs.addAttrForm.resetFields()
            },
            //添加参数
            addAttr(){
                this.$refs.addAttrForm.validate(valid=>{
                    if(!valid) return
                    this.$http.post(`categories/${this.cateId}/attributes`,
                        {attr_name:this.addAttrForm.attr_name,
                            attr_sel:this.activeName}).then(res=>{
                        console.log(res)
                        this.$message.success("添加属性成功！")
                        this.getParamsData()
                        this.addAtrrDialogVisible = false
                    })
                })
            },
            showInput(){
                this.addAttrValInputVisible = true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //修改参数项
            handleInputConfirm(params) {
                if (this.tagInputValue) {
                    params.attr_vals.push(this.tagInputValue);
                    console.log(params)
                    this.saveParams(params)
                }
                this.addAttrValInputVisible = false;
                this.tagInputValue = '';
            },
            //删除参数项
            removeParams(i,params){
                params.attr_vals.splice(i,1)
                this.saveParams(params)
            },
            //保存参数项
            saveParams(params){
                this.$http.put(`categories/${params.cat_id}/attributes/${params.attr_id}`,
                    {attr_name	: params.attr_name,
                        attr_sel: params.attr_sel,
                        attr_vals: params.attr_vals.join(' ')
                    }).then(res=>{
                    this.$message.success("修改成功！")
                })
            }
        }
    }
</script>

<style scoped>

</style>