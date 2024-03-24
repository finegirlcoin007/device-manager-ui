<template>
  <div style="width:100%;height:100%;">
    <!-- @click="clickmodel" -->
    <div class="three" ref="three" id="counter" @click="clickmodel">
      <div id="alert-css2" class="three-card">
        <div ref="marke">
          <div class="marke">
            <div class="marke-win">
              {{ device.deviceName }}
              <span style="color: #FF4A4A;"
                >({{ checkItem.alarmTypeStr }})</span
              >
            </div>
            <div class="marke-box">
              <div class="marke-box-c">
                <p>设备编码:{{ device.deviceName }}</p>
                <p>MAC地址:{{ device.deviceCode }}</p>
                <p>设备位置：{{ device.deviceName }}</p>
                <p>接收人员：{{ device.leadingOfficial }}</p>
                <p>负责人：{{ device.leadingOfficial }}</p>
                <p>联系电话：{{ device.leadingOfficialTelephone }}</p>
                <p>告警程度：--</p>
                <p>
                  告警时间：{{
                    $moment(checkItem.alarmTime).format("YYYY-MM-DD HH:mm")
                  }}
                </p>
                <p>
                  告警状态：<span style="color: #FF4A4A;"
                    >({{ checkItem.alarmTypeStr }})</span
                  >
                </p>
                <p>处理人：--</p>
                <p>处理时间：--</p>
                <p>发送状态：--</p>
                <p>发送时间：--</p>
                <p>发送内容：--</p>
              </div>
              <div class="ant-popover-arrow">
                <img src="./ycjg.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const bmkb = []; //便民看板
let renderer,
  camera,
  scene,
  controls,
  labelRenderer,
  Tips,
  ambientLight,
  directionalLight,
  TWEENN,
  SpotLight;
let keyobj = {}; //窗口模型
let modlObj = {}; //保存模型对象
let checkedMesh = null; //选中模型
let cloneMttl = null; //窗口材质备份
import * as THREE from "three";
window.THREE = THREE;
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { Tween, Easing } from "@tweenjs/tween.js";

let clock = new THREE.Clock();
// 设置渲染频率为30FBS，也就是每秒调用渲染器render方法大约30次
let FPS = 30;
let renderT = 1 / FPS; //单位秒  间隔多长时间渲染渲染一次
// 声明一个变量表示render()函数被多次调用累积时间
// 如果执行一次renderer.render，timeS重新置0
let timeS = 0;

// tween动画
function tweents(start, next, fn, times) {
  /**
   * @start object
   * @next object
   * @fn function
   */
  let coords = start;
  new Tween(coords)
    .to(next, times || 400)
    .easing(Easing.Quadratic.Out)
    .onUpdate((data) => {
      fn(data);
    })
    .start();
}
function updateCamera() {
  camera.updateProjectionMatrix();
}

/**
 * 物体是否在场景中显示
 * @param {THREE.Object3D} obj 3D物体
 * @return {Boolean} 是否在场景中显示
 * */
function ActiveInHierarchy(obj) {
  if (!obj.visible) {
    return false;
  }
  //遍历父对象
  let parent = obj.parent;
  while (parent) {
    if (!parent.visible) {
      return false;
    }
    parent = parent.parent;
  }
  return true;
}

class PositionGUI {
  constructor(obj, name) {
    this.obj = obj;
    this.name = name;
  }
  get modify() {
    return this.obj[this.name];
  }
  set modify(v) {
    this.obj[this.name] = v;
  }
}
let bmMark = []; //dom节点
export default {
  props: ["lv", "floorArr", "winMarkeList", "bm", "checkItem"], //checkItem选中窗口
  data() {
    return {
      bmkb, //便民看板
      isloading: true,
      floorList: {}, //楼层图
      floosrNum: "1",
      checkWind: {}, //选中窗口
      pngArr: [], //图片名称
      pngArrSmall: [], //小图标
    };
  },
  watch: {
    checkItem: {
      handler: function(str) {
        let winName = str.device.deviceCode;
        // let winName = '7E_CE_8B_C5_35_05'
        // console.log(keyobj,winName,keyobj[winName])
        if (keyobj[winName]) {
          const { x, y, z } = keyobj[winName].positions;
          Tips.position.set(x, y, z); //文字地址
          Tips.visible = true;
          // camera.position.x = x*0.5;
          // camera.position.y = y*0.8;
          // camera.position.z = z;
        } else {
          // Tips.visible = false
          Tips.position.set(0, 0, 0); //文字地址
          Tips.visible = true;

          this._initCamera();
        }
      },
      deep: true,
    },

    winMarkeList: {
      handler: function(v) {
        if (v.length > 0) {
          this.checkWind = v[0].coordinate;
          let window_fromnum = v[0].coordinate.window_fromnum;
          let winName = `${window_fromnum.slice(0, 1)}_${window_fromnum.slice(
            1
          )}`;
          if (keyobj[winName]) {
            // 选中模型为焦点

            const { x, y, z } = keyobj[winName].positions;
            Tips.position.set(x, y, z); //文字地址
            Tips.visible = true;
            // camera.position.x = x*0.5;
            // camera.position.y = y*0.8;
            // camera.position.z = z;
          } else {
            Tips.visible = false;
            this._initCamera();
          }
        }
      },
      deep: true,
    },
    // lv: function (e) {
    //     modlObj[this.floosrNum].obj.visible = false
    //     modlObj[e].obj.visible = true
    //     this.floosrNum = e
    //     this.css2DOM()
    // },
    floorArr: {
      handler: function(v) {
        let obj = {};
        v.forEach((v) => {
          obj[v.lv] = v;
        });
        this.floorList = obj;
        if (camera) {
          this._3Dloder();
        } else {
          setTimeout(() => {
            this._initTree();
          });
        }
      },
      deep: true,
    },
  },
  computed: {
    device: function() {
      return this.checkItem.device || {};
    },
  },
  mounted() {
    this._initTree();
    // let files = require.context('', false, /.png$/).keys();
    // let pngArr = []
    // files.forEach(v => {
    //     pngArr.push(v.match(/\/([\s\S]*?).png/)[1])
    // })
    // this.pngArr = pngArr
  },
  methods: {
    // 选中模型样式
    checkedModel(Mesh) {
      if (checkedMesh) {
        // delete checkedMesh.material
        Mesh.material = new THREE.MeshStandardMaterial({
          color: cloneMttl.color,
          wireframe: false,
          transparent: true,
        });
      }
      checkedMesh = Mesh;
      if (Mesh) {
        cloneMttl = JSON.parse(JSON.stringify(Mesh.material)); //备份材质
        // console.log(Mesh.material.color)
        Mesh.material = new THREE.MeshStandardMaterial({
          color: 0x1f78b7,
          wireframe: false,
          transparent: true,
          opacity: 0.8,
        });
      }
    },
    // 初始化镜头
    relaodCamera() {
      if (camera) {
        this._initCamera();
      }
      if (Tips) {
        Tips.visible = false;
      }
    },
    _initCamera() {
      camera.position.x = 0;
      camera.position.y = 2000;
      camera.position.z = 1000;
    },
    initGui() {
      let datGui = new GUI();
      //声明一个保存需求修改的相关数据的对象
      let gui = {
        ambientLight: "#9b9ba3", //环境光源
        directionalLight: "#0xffc288", //点光源
        intensity: 1, //灯光强度
        visible: true, //是否可见
        castShadow: true,
        exponent: 30,
        target: "plane",
        debug: false,
      };

      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
      datGui.addColor(gui, "ambientLight").onChange(function(e) {
        ambientLight.color = new THREE.Color(e);
      });
      datGui.add(gui, "intensity", 0, 5).onChange(function(e) {
        ambientLight.intensity = e;
      });
      datGui.addColor(gui, "directionalLight").onChange(function(e) {
        directionalLight.color = new THREE.Color(e);
      });
      datGui.add(gui, "intensity", 0, 5).onChange(function(e) {
        directionalLight.intensity = e;
      });
      datGui.add(gui, "visible").onChange(function(e) {
        directionalLight.visible = e;
      });
      datGui.add(gui, "castShadow").onChange(function(e) {
        directionalLight.castShadow = e;
      });
      datGui.add(gui, "debug").onChange(function(e) {
        if (e) {
          var debug = new THREE.CameraHelper(directionalLight.shadow.camera);
          debug.name = "debug";
          scene.add(debug);
        } else {
          // var debug = scene.getObjectByName("debug");
          // scene.remove(debug);
        }
      });
      datGui.add(camera, "fov", 1, 18000).onChange(updateCamera);
      datGui.add(camera, "near", 1, 20000).onChange(updateCamera);
      datGui.add(camera, "far", 1, 20000).onChange(updateCamera);

      const folder = datGui.addFolder("全局Position");
      folder
        .add(new PositionGUI(camera.position, "x"), "modify", 0, 20000)
        .name("x");
      folder
        .add(new PositionGUI(camera.position, "y"), "modify", 0, 20000)
        .name("y");
      folder
        .add(new PositionGUI(camera.position, "z"), "modify", 0, 20000)
        .name("z");
    },
    _initTree() {
      scene = new THREE.Scene();
      // alert(this.$el.offsetWidth)
      // alert(this.$el.offsetHeight)
      let screenW = this.$el.offsetWidth;
      let screenH = this.$el.offsetHeight;
      camera = new THREE.PerspectiveCamera(25, screenW / screenH, 0.01, 20000);
      this._initCamera();
      camera.lookAt(scene.position);

      renderer = new THREE.WebGLRenderer({
        antialias: true, //开启抗锯齿
        logarithmicDepthBuffer: true, //对数深度缓存解决模型重叠
        alpha: true, //背景透明
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 设置投影类型, 这边的柔和投影
      renderer.setSize(screenW, screenH);
      // renderer.setAnimationLoop( this.animation );

      this.$refs.three.appendChild(renderer.domElement);

      this._Light();
      this.css2controls();
      // controls.autoRotate = true
      // 左右旋转范围
      controls.minAzimuthAngle = -Math.PI * (100 / 360);
      controls.maxAzimuthAngle = Math.PI * (100 / 360);
      controls.minDistance = 500;
      controls.maxDistance = 1500;
      controls.maxPolarAngle = 1.2;
      controls.minPolarAngle = 0.8;
      if (process.env.NODE_ENV == "development") {
        this.initGui();
      }
      this.animation();
    },
    animation() {
      // TWEEN.update()
      requestAnimationFrame(this.animation);
      let T = clock.getDelta();
      timeS = timeS + T;
      // requestAnimationFrame默认调用render函数60次，通过时间判断，降低renderer.render执行频率
      if (timeS > renderT) {
        // 控制台查看渲染器渲染方法的调用周期，也就是间隔时间是多少
        // console.log(`调用.render时间间隔`,timeS*1000+'毫秒');
        controls.update();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
        //renderer.render每执行一次，timeS置0
        timeS = 0;
      }
      // console.log(2222);
      // controls.update();
      // renderer.render( scene, camera );
      // labelRenderer.render( scene, camera );
    },
    css2renderer() {
      let screenW = this.$el.offsetWidth;
      let screenH = this.$el.offsetHeight;
      let css2dom = document.getElementById("alert-css2");
      Tips = new CSS2DObject(css2dom);
      Tips.position.set(0, 0, 0); //文字地址
      Tips.visible = false;
      scene.add(Tips);
      labelRenderer = new CSS2DRenderer(); //新建CSS2DRenderer
      labelRenderer.setSize(screenW, screenH);
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.top = 0;
      this.$refs.three.appendChild(labelRenderer.domElement);
    },
    css2controls() {
      this.css2renderer();
      controls = new OrbitControls(camera, labelRenderer.domElement);
      var counter = document.getElementById("counter");
      counter.appendChild(renderer.domElement);
    },
    _Light() {
      ambientLight = new THREE.AmbientLight(0xffffff, 1);
      ambientLight.position.set(0, 0, 0);
      scene.add(ambientLight);
      directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.castShadow = true;
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);
      // SpotLight = new THREE.SpotLight(0xffffff,1);
      // SpotLight.castShadow = true;
      // SpotLight.position.set( 385.522, 1132.217, 1825.427 );
      // scene.add(SpotLight)
    },
    _3Dloder() {
      let _this = this;
      let MTLLoaders = new MTLLoader();
      let OBJLoaders = new OBJLoader();
      let GLTFLoaders = new GLTFLoader();
      OBJLoaders.setCrossOrigin("Anonymous"); //跨域问题
      const { floorList } = this;
      for (const iterator in floorList) {
        const mtl = floorList[iterator].mtl_url;
        const obj = floorList[iterator].obj_url;
        if (obj.search(/.obj/i) >= 0) {
          // 模型
          MTLLoaders.load(mtl, function(materials) {
            //obj的模型会和MaterialCreator包含的材质对应起来
            OBJLoaders.setMaterials(materials);
            OBJLoaders.load(obj, function(obj) {
              if (_this.lv !== iterator) {
                obj.visible = false;
              }

              modlObj[iterator] = {
                position: {
                  x: 0,
                  y: 0,
                  z: 0,
                },
                obj: obj,
              };
              _this.isloading = false;
              scene.add(obj); //返回的组对象插入场景中
              // this.initWinname(this.winname)
            });
          });
        } else if (obj.search(/.gltf/i) >= 0) {
          GLTFLoaders.load(obj, function(obj) {
            // console.log(obj,'@@@@@@@');
            const children = obj.scene.children[0].children;
            const positionY = (iterator - 1.7) * 200;
            children.forEach((element) => {
              let objname = element.name;

              // mac地址模型
              if (objname.length > 12) {
                // console.log(objname,"#######",iterator);
                try {
                  // console.log(objname,"#######");
                  // 获取外部模型具体点击位置  obj模型没有位置
                  element.geometry.computeBoundingSphere();
                  // 球体中心点
                  let realPosition = element.geometry.boundingSphere.center;
                  element["positions"] = JSON.parse(
                    JSON.stringify(realPosition)
                  );
                  element["positions"].y = positionY;
                  keyobj[objname] = element;
                } catch (error) {}
              }
            });

            // if (_this.lv !== iterator) {
            //     obj.scene.visible = false
            //     // obj.scene.position.y = 100
            // }
            obj.scene.position.y = positionY;
            modlObj[iterator] = {
              position: {
                x: 0,
                y: positionY,
                z: 0,
              },
              obj: obj.scene,
            };
            scene.add(obj.scene); //返回的组对象插入场景中
            _this.isloading = false;
          });
        }
      }
    },
    // 标签渲染
    css2Tip(dom, position) {
      const { x, y, z } = position;
      let screenW = this.$el.offsetWidth;
      let screenH = this.$el.offsetHeight;
      let css2dom = dom;
      let Tipss = new CSS2DObject(css2dom);
      Tipss.position.set(x, y, z); //文字地址
      Tipss.visible = true;
      scene.add(Tipss);
      let labelRenderer = new CSS2DRenderer(); //新建CSS2DRenderer
      labelRenderer.setSize(screenW, screenH);
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.top = 0;
      labelRenderer.domElement.style.zIndex = 0;
      this.$refs.three.appendChild(labelRenderer.domElement);

      new OrbitControls(camera, labelRenderer.domElement);
      var counter = document.getElementById("counter");
      counter.appendChild(renderer.domElement);
    },
    // 查询楼层dom节点显示/隐藏
    css2DOM(childNodes) {
      let childDom = childNodes;
      if (!childDom) {
        childDom = document.getElementById("counter");
      }
      // console.log(childDom.childNodes);
      childDom.childNodes.forEach((em) => {
        if (em.nodeName == "DIV") {
          let lv = em.getAttribute("data-lv");
          // 只显示小图标
          if (lv) {
            if (lv == this.lv && em.className == "bg_bm") {
              em.style.opacity = 1;
            } else {
              em.style.opacity = 0;
            }
          }
          this.css2DOM(em);
        }
      });
    },
    // 选中模型
    getIntersects(event) {
      // 声明 raycaster 和 mouse 变量
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
      let container = this.$refs.three;
      let getBoundingClientRect = container.getBoundingClientRect();
      mouse.x =
        ((event.clientX - getBoundingClientRect.left) / container.offsetWidth) *
          2 -
        1;
      mouse.y =
        -(
          (event.clientY - getBoundingClientRect.top) /
          container.offsetHeight
        ) *
          2 +
        1;

      //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, camera);

      // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
      const intersects = raycaster.intersectObjects(scene.children, true);

      //返回选中的对象
      return intersects;
    },
    clickmodel(event) {
      let intersects = this.getIntersects(event);
      // 获取选中最近的 Mesh 对象
      if (
        intersects.length != 0 &&
        intersects[0].object instanceof THREE.Mesh
      ) {
        let selectObject = intersects[0].object;
        // this.changeMaterial(selectObject);
        // this.outlineObj(selectObject)
        // 获取外部模型具体点击位置
        selectObject.geometry.computeBoundingSphere();
        // 球体中心点
        let realPosition = selectObject.geometry.boundingSphere.center;

        console.log(selectObject, ActiveInHierarchy(selectObject));
        //   如果选中窗口标注窗口信息
        if (keyobj[selectObject.name] && ActiveInHierarchy(selectObject)) {
          const winnames = selectObject.name.split("_");
          this.$emit("clickWin", {
            winName: winnames[0] + winnames[1],
            ...realPosition,
          });
        } else {
          this.$emit("clickWin", "");
        }
      } else {
        this.$emit("clickWin", "");
        console.log("未选中 Mesh!");
      }
    },
  },
};
</script>
<style>
.three-reload {
  position: absolute;
  left: 50%;
  bottom: 50px;
  border-radius: 8px;
  border: 2px solid #fff;
  color: #333;
  background: rgba(255, 255, 255, 0.5);
  width: 200px;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  z-index: 99;
  text-align: center;
  margin-left: -100px;
  cursor: pointer;
}

.bg_bm {
  background-repeat: no-repeat;
  margin-top: -30px;
  pointer-events: none;
}

.check_bm {
  margin-top: -70px;
}
</style>
<style lang="less" scoped>
.three {
  width: 100%;
  height: 100%;
}

.three-card {
  width: 200px;
  height: 241px;
  margin-top: -140px;
  pointer-events: none;
}

.marke {
  position: absolute;
  width: 200px;
  background: #3673c39c;
  .marke-win {
    height: 40px;
    line-height: 40px;
    background: #3672c3;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    padding: 0 12px;
    box-sizing: border-box;
  }

  .marke-box {
    margin-top: 4px;
    padding: 5px 12px 0 12px;
    position: relative;

    .marke-box-c {
      position: relative;
      z-index: 1;
      height: 100%;
      padding-bottom: 12px;
    }

    p {
      font-size: 12px;
      // font-weight: bold;
      color: #fff;
      line-height: 1.5;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .box {
    border-top: 1px solid #ebebeb;
    padding-top: 10px;
    font-size: 14px;
    color: #999999;
  }

  .ant-popover-arrow {
    position: absolute;
    display: block;
    width: 20px;
    height: 20px;
    left: 50%;
    margin-left: -10px;
    bottom: -10;
  }
}

.bmkb {
  position: absolute;
  bottom: 100px;
  width: 100%;
  padding: 0 310px;
  box-sizing: border-box;

  ul {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  li {
    width: 16.6%;
    font-size: 16px;
    color: #333;
    margin-bottom: 26px;
  }

  img {
    vertical-align: middle;
    margin-right: 14px;
  }
}
</style>
