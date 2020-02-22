import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import DataMenu from '@/pages/data/DataMenu'
import index from '@/pages/index/index'
import MonitorMenu from '@/pages/monitor/MonitorMenu'
import ProcessDataMenu from '@/pages/process_data/ProcessDataMenu'
import inorganization from '@/components/data/online/Inoranization/InorganizationTable'
import datashow from '@/components/data/online/mainport/MainoutletTable'
import ProductionTable from '@/components/data/equipment/ProductionTable'
import PollutionTable from '@/components/data/equipment/PollutionTable'
import WarnRecord from '@/components/data/warning/WarnRecord'
import DocumentProcess from '@/components/data/warning/DocumentProcess'
import ThirdTest from '@/components/data/environmental_data/ThirdTest'
import ThirdOperations from '@/components/data/equipment_data/ThirdOperations'
import SelfTable from '@/components/data/equipment_data/SelfTable'
import menu from '@/pages/menu'
import WorkMenu from '@/pages/work/WorkMenu' // 环保工作管理
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      component: index
    },
    {
      path: '/menu',
      component: menu,
      children: [
        {
          path: '/data',
          component: DataMenu,
          children: [
            {
              path: '',
              redirect: 'datashow'
            },
            {
              path: 'datashow',
              component: datashow
            },
            {
              path: 'inorganization',
              component: inorganization
            },
            // {
            //   path: 'PostationTable',
            //   component: PostationTable
            // },
            {
              path: 'AirTable',
              component: () => import('@/components/data/report/airdata/AirTable') // 大气数据
            },
            {
              path: 'IntermediateTable',
              component: () => import('@/components/data/report/interdata/IntermediateTable') // 中水数据
            },
            {
              path: 'LampblackTable',
              component: () => import('@/components/data/report/lampblack/LampblackTable') // 油烟数据
            },
            {
              path: 'NaosiyTable',
              component: () => import('@/components/data/report/nosiydata/NosiyTable') // 噪声数据
            },
            {
              path: 'RadiationTable',
              component: () => import('@/components/data/report/radiation/RadiationTable')
            },
            {
              path: 'SoilTable',
              component: () => import('@/components/data/report/soildata/SoilTable')
            },
            {
              path: 'ProductionTable',
              component: ProductionTable
            },
            {
              path: 'PollutionTable',
              component: PollutionTable
            },
            {
              path: 'WarnRecord',
              component: WarnRecord
            },
            {
              path: 'DocumentProcess',
              component: DocumentProcess
            },
            {
              path: "ThirdTest",
              component: ThirdTest
            },
            {
              path: "ThirdOperations",
              component: ThirdOperations
            },
            {
              path: "SelfTable",
              component: SelfTable
            }
          ]
        },
        {
          path: '/monitoring',
          component: MonitorMenu
        },
        {
          path: '/nanlysis', //工艺数据分析
          component: ProcessDataMenu
        },
        {
          path: '/hazardous',
          component: () => import('@/pages/dangerous_waste/DangerousWasteMenu')
        },
        {
          path: '/file',
          component: () => import('@/pages/file/FileMenu'),
          children: [
            {
              path: '',
              redirect: 'ArchivesTable'
            },
            {
              path: 'ArchivesTable',
              component: () => import('@/components/file/archives/ArchivesTable')
            },

            {
              path: 'ParameterTable',
              component: () => import('@/components/file/parameter/ParameterTable')
            }
            , {
              path: 'GraphicalTable',
              component: () => import('@/components/file/graphical/GraphicalTable')
            }
            , {
              path: 'PlatformTable',
              component: () => import('@/components/file/platform/PlatformTable')
            }
            , {
              path: 'StatisticalTable',
              component: () => import('@/components/file/statistical/StatisticalTable')
            }
          ]
        },
        {
          path: '/work',
          component: WorkMenu,
          children: [
            {
              path: '',
              redirect: 'welPublish' //发布信息
            },
            {
              path: 'welPublish',
              component: () => import('@/components/work/welAssignment/AddAssignment') //发布信息
            },
            {
              path: 'welDepCooper',
              component: () => import('@/components/work/welAssignment/DepcooperTable') //部门配合
            },
            {
              path: 'welResult',
              component: () => import('@/components/work/welAssignment/AssignmentResult') // 检查结果
            },
            {
              path: 'welContent',
              component: () => import('@/components/work/welAssignment/AssignmentContent') // 整改内容
            },
            {
              path: 'welBack',
              component: () => import('@/components/work/welAssignment/AssignmentBack') // 整改反馈
            },
            {
              path: 'welCount',
              component: () => import('@/components/work/welAssignment/AssignmenCount') // 任务统计
            },
            {
              path: 'routWork',
              component: () => import('@/components/work/routing/InspectionWork') // 巡检工作
            },
            {
              path: 'routDepart',
              component: () => import('@/components/work/routing/DepartDisposal') // 部门处置
            },
            {
              path: 'routAudting',
              component: () => import('@/components/work/routing/RectifyAuditing') // 整改审核
            },
          {
            path: 'taskRelease',
              component: () => import('@/components/work/special/TaskRelease')  //任务发布
          },
          {
            path: 'taskProcessing',//任务处理
              component: () => import('@/components/work/special/TaskProcessing'), //任务处理
          },
          ]
        },
        {
          path: '/system',
          component: () => import('@/pages/system/SystemMenu'),
          children: [
            // {
            //   path: 'PostationTable',
            //   component:()=>import('@/components/system/auth/PostationTable')
            // },
            {
              path: 'StaffTable',
              component: () => import('@/components/system/auth/StaffTable')
            },
            {
              path: '',
              redirect: 'AuthTable'
            },
            {
              path: 'AuthTable',
              component: () => import('@/components/system/auth/AuthTable')
            },
            {
              path: 'DepartmentTable',
              component: () => import('@/components/system/auth/DepartmentTable')
            },
            {
              path: 'EquipmentTable', // 设备
              component: () => import('@/components/system/dictionary/EquipmentTable')
            },
            {
              path: 'DrainTable',
              component: () => import('@/components/system/dictionary/DrainTable') // 排污口
            },
            {
              path: 'TestProTable',
              component: () => import('@/components/system/dictionary/TestProTable') // 监测项目
            },
            {
              path: 'ProcessSection', //工艺段
              component: () => import('@/components/system/dictionary/ProcessSection')
            },
            {
              path: 'MonitorUnit', // 监测单位
              component: () => import('@/components/system/dictionary/MonitorUnit')
            },
            {
              path: 'FileLevel',//档案级别
              component: () => import('@/components/system/dictionary/FileLevel')
            },
            {
              path: 'ReportFile',//报表管理
              component: () => import('@/components/system/report/ReportFile')
            },
            {
              path: 'GraphicsEdition',// 图形编辑
              component: () => import('@/components/system/report/GraphicsEdition')
            },
          {
          path: 'Taskcategory',// 专项任务
            component: () => import('@/components/system/task/TaskCategory')
        },
          ]
        },
      ]
    }
  ]
})
