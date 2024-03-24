// 全局组件注册
import LayoutTable from '@/components/Table.vue';
import LayoutForm from '@/components/Form.vue';
import TableButtons from '@/components/tools/TableButtons';
import FormButtons from '@/components/tools/FormButtons';
import Breadcrumb from '@/components/Breadcrumb';
import MySwitch from '@/components/Switch';
import DeviceSwitch from '@/components/DeviceSwitch';
import Confirm from '@/components/Confirm';
import FormField from '@/components/FormField';
import Upload from '@/components/Upload';
import ImageUpload from '@/components/ImageUpload';
import ImagePreview from '@/components/ImagePreview';
import FileUpload from '@/components/FileUpload';
import Editor from '@/components/Editor';
import Map from '@/components/Map';
import MapDetail from '@/components/MapDetail';

const Prototype = function() {};

Prototype.install = (Vue, options) => {
  Vue.component('LayoutTable', LayoutTable) // 表格
  Vue.component('LayoutForm', LayoutForm) // 表单
  Vue.component('TableButtons', TableButtons) // 表格内的编辑和删除
  Vue.component('FormButtons', FormButtons) // 表单内的保存和取消
  Vue.component('Breadcrumb', Breadcrumb) // 面包屑导航
  Vue.component('Field', FormField) // 表单字段
  Vue.component('MySwitch', MySwitch) // 拨动开关
  Vue.component('DeviceSwitch', DeviceSwitch) // 拨动开关
  Vue.component('Confirm', Confirm) // 局部确认窗口
  Vue.component('Upload', Upload) // 文件上传
  Vue.component('ImageUpload', ImageUpload) // 图片上传
  Vue.component('ImagePreview', ImagePreview) // 图片预览
  Vue.component('FileUpload', FileUpload) // 文件上传
  Vue.component('Editor', Editor) // 富文本
  Vue.component('Map', Map) // 地图
  Vue.component('MapDetail', MapDetail) // 地图
}

export default Prototype;
