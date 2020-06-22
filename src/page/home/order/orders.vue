<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="6" class="mar-right">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="queryGood">
                        <el-button slot="append" icon="el-icon-search" @click="queryGood"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orders" stripe border style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格(元)" width="100px"></el-table-column>
                <el-table-column prop="pay_status" label="是否付款" width="80px">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.pay_status === '0'" >未付款</el-tag>
                        <el-tag type="success" v-else >已付款</el-tag>

                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="100px"></el-table-column>
                <el-table-column label="下单时间" width="150px">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="132px">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改地址"  placement="top-start">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click="showAddress" class="mar-right"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看物流" placement="top-start">
                                <el-button type="success" icon="el-icon-location"
                                           @click="showProgress(scope.row.user_id)" size="mini" ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[2, 5, 10, 15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="修改地址"
                   :visible.sync="addressVisible"
                   @close="addressClose"
                   width="50%">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader
                            expand-trigger="hover"
                            :options="citydata"
                            v-model="addressForm.address1"
                            @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
             <span slot="footer" class="dialog-footer">
                 <el-button @click="addressVisible = false">取 消</el-button>
                 <el-button type="primary" @click="addressVisible = false">确 定</el-button>
             </span>
        </el-dialog>

        <el-dialog title="物流信息" width="50%" :visible.sync="progressVisible">
            <el-timeline>
                <el-timeline-item
                        v-for="(activity, index) in progressList"
                        :key="index"
                        :timestamp="activity.ftime">
<!--                    <span>地址：{{activity.location}}</span>-->
                    <span>{{activity.context}}</span>
                </el-timeline-item>
            </el-timeline>
             <span slot="footer" class="dialog-footer">
                 <el-button @click="progressVisible = false">取 消</el-button>
                 <el-button type="primary" @click="progressVisible = false">确 定</el-button>
             </span>
        </el-dialog>
    </div>

</template>

<script>
    import citydata from "./citydata";

    export default {
        name: "order",
        data(){
            return{
                queryInfo:{
                    // 查询参数
                    query:'',
                    // 页数
                    pagenum:1,
                    // 条数
                    pagesize:5,
                    // 用户id
                    user_id:'',
                    // 支付状态
                    pay_status:'',
                    // 是否发货
                    is_send:'',
                    // 【个人：公司】
                    order_fapiao_title:'',
                    // 公司名称
                    order_fapiao_company:'',
                    // 发票内容
                    order_fapiao_content:'',
                    // 发货地址
                    consignee_addr:''

                },
                orders:[],
                total:'',
                addressVisible:false,
                addressForm:{
                    address1:'',
                    address2:''
                },
                addressFormRules:{
                    address2:[{required: true, message: '请输入详细地址', trigger: 'blur' },]
                },
                citydata:citydata,
                progressVisible:false,
                progressList:[]

            }
        },
        created() {
            this.getOrders()
        },
        methods:{
            getOrders(){
                this.$http.get('orders',{params:this.queryInfo}).then(res=>{
                    this.orders = res.data.data.goods
                    this.total = res.data.data.total
                    }
                )
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getOrders()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getOrders()
            },
            showAddress(){
                this.addressVisible = true
            },
            addressClose(){
                this.$refs.addressFormRef.resetFields()
            },
            showProgress(id){
                console.log(1)
                this.$http.get(`/kuaidi/1106975712662`).then(res=>{
                    console.log(res)
                    this.progressList = res.data.data
                })
                this.progressVisible = true

            }
        }
    }
</script>

<style scoped>

</style>