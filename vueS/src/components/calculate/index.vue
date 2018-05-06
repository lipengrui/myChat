<template>
  <div class="discounts ly_relative warper">
      <div class="tip_nav">
        <div class="title">
          <el-breadcrumb separator="/" class="tip-breadcrumb ">
                <el-breadcrumb-item>练习中心</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="list_content">
           <div class="mt10 st_text_alignL st_line_height0">
               <div class="prompt">日期区间：</div>
                <el-date-picker
                  class="ml10"
                  v-model="param.startMonth"
                  type="month"
                  placeholder="请选择年月">
                </el-date-picker>
                <div class="prompt">至</div>
                <el-date-picker
                  class="ml10"
                  v-model="param.endMonth"
                  type="month"
                  placeholder="请选择年月">
                </el-date-picker>
                <el-button class="el-icon-search ml10" @click="getLookAction(1)"> 查询</el-button>
           </div>
          <div class="content list-content mt20 st_line_height0">
              <el-table
                :data="tableData"
                stripe
                :highlight-current-row="true"
                style="width: 100%">
                <el-table-column
                    fixed
                  prop="date"
                  label="结算日期"
                  >
                </el-table-column>
                <el-table-column
                  prop="money"
                  label="结算金额">
                </el-table-column>
                <!-- <el-table-column
                fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" class="txt-info el-icon-view" @click="examineAction(scope.row)"> 查看</el-button>
                  </template>
                </el-table-column> -->
              </el-table>
          </div>
      </div>
      <div class="warper_list ly_absolute ly_absoluteB0 ly_absoluteLR0">
        <span>共计 <em>{{total}}</em> 条</span>
        <el-pagination
          @current-change="getLookAction"
          background
          :page-size="10"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'calculate',
  data(){
      return{
discounts:'结算中心',
        dialogVisible:false,
        param:{
          name:'',
          type:'',
          startMonth:'',
          endMonth: ''
        },
        total:10,
        options:[
          {
            key:'1',
            label:'直购券'
          },
          {
            key:'2',
            label:'折扣券'
          }
        ],
        tableData: []
      }
  },
  methods:{
    getLookAction: function () {

    },
    examineAction: function () {

    }
  }
}
</script>
<style lang="css" scoped>
.st_line_height0{
    line-height: 0;
}
.prompt{
    display: inline-block;
}
.st_text_alignL{
    text-align: left;
}
</style>

