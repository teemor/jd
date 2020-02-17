<template>
  <div>
    <div>
      <el-button size="mini" type="primary" @click="addUser">新增岗位</el-button>
    </div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="员工姓名">
          <el-input size="mini" v-model="formInline.user" placeholder="员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input size="mini" v-model="formInline.name" placeholder="用户级别"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <general-table
        :body="tableData"
        :showPagination="true"
        :total="tableData.total"
        @paginationChange="paginationChange"
      >
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editUser(scope.row)">
              <template>编辑</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: {
        header: [
          {
            prop: "dp",
            value: "岗位名称"
          },
          {
            prop: "fname",
            value: "排序码"
          },
          {
            prop: "number",
            value: "启用"
          }
        ],
        tableData: [],
        total: 0
      },
      formInline: {},
      data2: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ]
    };
  },
  methods: {
    onSubmit() {},
    paginationChange() {}
  }
};
</script>

<style>
</style>